export interface SubspaceConfig {
    hubUrl: string;
    hubTopic: string;
    accessToken?: string;
    wsEndpoint?: string;
    isSubscribed: boolean;
}

export interface SubspaceEvent {
    id: string;
    timestamp: string;
    event: {
        'hub.topic': string;
        'hub.event': string;
        context: any[];
    };
}

export interface SubspaceEventHandlers {
    onPatientOpen?: (context: any[]) => void;
    onPatientClose?: (context: any[]) => void;
    onUserLogin?: (context: any[]) => void;
    onShutdown?: (context: any[]) => void;
    onError?: (error: string) => void;
    onConnectionChange?: (isConnected: boolean) => void;
}

class SubspaceService {
    private config: SubspaceConfig | null = null;
    private websocket: WebSocket | null = null;
    private eventHandlers: SubspaceEventHandlers = {};
    private isInitialized = false;

    /**
     * Extract Subspace launch parameters from URL
     */
    public extractLaunchParams(): { hubUrl?: string; hubTopic?: string } {
        const urlParams = new URLSearchParams(window.location.search);

        const hubUrl = urlParams.get('hub.url') ?? undefined;
        const hubTopic = urlParams.get('hub.topic') ?? undefined;

        console.log('Subspace launch parameters:', { urlParams, hubUrl, hubTopic });

        return { hubUrl, hubTopic };
    }

    /**
     * Initialize Subspace connection
     */
    public async initialize(hubUrl: string, hubTopic: string): Promise<SubspaceConfig> {
        if (this.isInitialized) {
            throw new Error('Subspace already initialized');
        }

        try {
            console.log('Initializing Subspace with:', { hubUrl, hubTopic });

            // Step 1: Get access token
            const accessToken = await this.getAccessToken(hubUrl);

            // Step 2: Subscribe to events
            const wsEndpoint = await this.subscribe(hubUrl, hubTopic, accessToken);

            // Step 3: Connect WebSocket
            await this.connectWebSocket(wsEndpoint);

            this.config = {
                hubUrl,
                hubTopic,
                accessToken,
                wsEndpoint,
                isSubscribed: true
            };

            this.isInitialized = true;
            console.log('Subspace initialized successfully');

            return this.config;
        } catch (error) {
            console.error('Subspace initialization failed:', error);
            this.cleanup();
            throw error;
        }
    }

    /**
     * Set event handlers
     */
    public setEventHandlers(handlers: SubspaceEventHandlers): void {
        this.eventHandlers = { ...handlers };
    }

    /**
     * Send a request for context change to Epic
     */
    public async sendContextChangeRequest(eventName: string, context: any[]): Promise<void> {
        if (!this.config?.hubUrl || !this.config?.accessToken) {
            throw new Error('Subspace not initialized');
        }

        const request = {
            id: this.generateId(),
            timestamp: new Date().toISOString(),
            event: {
                'hub.topic': this.config.hubTopic,
                'hub.event': eventName,
                context
            }
        };

        try {
            const response = await fetch(this.config.hubUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${this.config.accessToken}`
                },
                body: JSON.stringify(request)
            });

            if (!response.ok) {
                throw new Error(`Context change request failed: ${response.status}`);
            }

            console.log('Context change request sent successfully:', eventName);
        } catch (error) {
            console.error('Failed to send context change request:', error);
            throw error;
        }
    }

    /**
     * Open a patient chart
     */
    public async openPatient(patientId: string): Promise<void> {
        const context = [
            {
                key: 'patient',
                resource: {
                    resourceType: 'Patient',
                    id: patientId
                }
            }
        ];

        await this.sendContextChangeRequest('Patient-open', context);
    }

    /**
     * Close current patient chart
     */
    public async closePatient(): Promise<void> {
        await this.sendContextChangeRequest('Patient-close', []);
    }

    /**
     * Get current configuration
     */
    public getConfig(): SubspaceConfig | null {
        return this.config;
    }

    /**
     * Check if Subspace is connected
     */
    public isConnected(): boolean {
        return this.websocket?.readyState === WebSocket.OPEN && this.config?.isSubscribed === true;
    }

    /**
     * Cleanup resources
     */
    public cleanup(): void {
        if (this.websocket) {
            this.websocket.close();
            this.websocket = null;
        }

        if (this.config) {
            this.config.isSubscribed = false;
        }

        this.isInitialized = false;
        console.log('Subspace cleaned up');
    }

    // Private methods

    private async getAccessToken(hubUrl: string): Promise<string> {
        try {
            const clientAssertion = await this.createClientAssertion(hubUrl);

            const response = await fetch(`${hubUrl}/token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    grant_type: 'client_credentials',
                    client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
                    client_assertion: clientAssertion
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    `Token request failed: ${response.status} - ${errorData.error_description || response.statusText}`
                );
            }

            const tokenData = await response.json();
            console.log('Access token obtained, scope:', tokenData.scope);

            return tokenData.access_token;
        } catch (error) {
            console.error('Failed to get access token:', error);
            throw error;
        }
    }

    private async createClientAssertion(hubUrl: string): Promise<string> {
        // Get configuration endpoint to determine audience
        let audience = hubUrl;

        try {
            const configResponse = await fetch(`${hubUrl}/subspace-configuration`, {
                headers: {
                    'Epic-Client-ID': import.meta.env.VITE_APP_CLIENT_ID
                }
            });

            if (configResponse.ok) {
                const configData = await configResponse.json();
                audience = configData.audience || hubUrl;
                console.log('Using audience from config:', audience);
            }
        } catch (error) {
            console.warn('Could not get subspace configuration, using hubUrl as audience');
        }

        const header = {
            alg: 'RS384',
            typ: 'JWT'
        };

        const payload = {
            iss: import.meta.env.VITE_APP_CLIENT_ID,
            sub: import.meta.env.VITE_APP_CLIENT_ID,
            aud: audience,
            exp: Math.floor(Date.now() / 1000) + 300, // 5 minutes
            jti: this.generateId()
        };

        // TODO: Implement actual JWT signing with RS384
        // You'll need to use a library like 'jose' or implement signing
        // For now, this throws an error to remind you to implement it

        const privateKey = import.meta.env.VITE_SUBSPACE_PRIVATE_KEY;
        if (!privateKey) {
            throw new Error('VITE_SUBSPACE_PRIVATE_KEY environment variable not set');
        }

        // Placeholder for JWT signing - replace with actual implementation
        throw new Error('JWT signing not implemented. You need to implement RS384 signing with your private key.');

        // Example of what you'd do with 'jose' library:
        // import { SignJWT } from 'jose';
        // const privateKeyObject = await importPKCS8(privateKey, 'RS384');
        // return await new SignJWT(payload)
        //     .setProtectedHeader(header)
        //     .setIssuedAt()
        //     .sign(privateKeyObject);
    }

    private async subscribe(hubUrl: string, hubTopic: string, accessToken: string): Promise<string> {
        const events = [
            'Patient-open',
            'Patient-close',
            'com.epic.userlogin',
            'com.epic.userlogout',
            'com.epic.shutdown'
        ];

        const response = await fetch(hubUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Bearer ${accessToken}`
            },
            body: new URLSearchParams({
                'hub.topic': hubTopic,
                'hub.mode': 'subscribe',
                'hub.events': events.join(','),
                'hub.channel.type': 'websocket'
            })
        });

        if (!response.ok) {
            throw new Error(`Subscription failed: ${response.status}`);
        }

        const subscriptionData = await response.json();
        console.log('Subscription response:', subscriptionData);

        if (!subscriptionData['hub.channel.endpoint']) {
            throw new Error('No WebSocket endpoint provided in subscription response');
        }

        return subscriptionData['hub.channel.endpoint'];
    }

    private async connectWebSocket(wsEndpoint: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.websocket = new WebSocket(wsEndpoint);

            this.websocket.onopen = () => {
                console.log('Subspace WebSocket connected');
                this.eventHandlers.onConnectionChange?.(true);
                resolve();
            };

            this.websocket.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    this.handleWebSocketMessage(data);
                } catch (error) {
                    console.error('Failed to parse WebSocket message:', error);
                }
            };

            this.websocket.onerror = (error) => {
                console.error('Subspace WebSocket error:', error);
                this.eventHandlers.onError?.('WebSocket connection error');
                reject(new Error('WebSocket connection failed'));
            };

            this.websocket.onclose = () => {
                console.log('Subspace WebSocket disconnected');
                this.eventHandlers.onConnectionChange?.(false);
                if (this.config) {
                    this.config.isSubscribed = false;
                }
            };

            // Set a timeout for connection
            setTimeout(() => {
                if (this.websocket?.readyState !== WebSocket.OPEN) {
                    reject(new Error('WebSocket connection timeout'));
                }
            }, 10000);
        });
    }

    private handleWebSocketMessage(data: any): void {
        console.log('Subspace message received:', data);

        // Handle subscription confirmation
        if (data.hub?.mode === 'subscribe') {
            console.log('Subscription confirmed:', data);
            return;
        }

        // Handle subscription denial
        if (data.hub?.mode === 'denied') {
            console.error('Subscription denied:', data.hub.reason);
            this.eventHandlers.onError?.(`Subscription denied: ${data.hub.reason}`);
            return;
        }

        // Handle Epic events
        if (data.event) {
            this.handleSubspaceEvent(data);

            // Send acknowledgment
            if (this.websocket && data.id) {
                this.websocket.send(
                    JSON.stringify({
                        id: data.id,
                        status: 202
                    })
                );
            }
        }
    }

    private handleSubspaceEvent(eventData: SubspaceEvent): void {
        const eventType = eventData.event['hub.event'];
        const context = eventData.event.context;

        console.log(`Handling Subspace event: ${eventType}`, context);

        switch (eventType) {
            case 'Patient-open':
                this.eventHandlers.onPatientOpen?.(context);
                break;
            case 'Patient-close':
                this.eventHandlers.onPatientClose?.(context);
                break;
            case 'com.epic.userlogin':
                this.eventHandlers.onUserLogin?.(context);
                break;
            case 'com.epic.userlogout':
            case 'com.epic.shutdown':
                this.eventHandlers.onShutdown?.(context);
                break;
            default:
                console.log('Unknown event type:', eventType);
        }
    }

    private generateId(): string {
        return Math.random().toString(36).substring(2) + Date.now().toString(36);
    }
}

// Export singleton instance
export const subspaceService = new SubspaceService();
