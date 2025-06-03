import { CircularProgress } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import FHIR from 'fhirclient';
import { JSX, StrictMode, useCallback, useEffect, useState } from 'react';

import App from '@/app';
import { SubspaceConfig, SubspaceEventHandlers, subspaceService } from '@/subspace.service';
import ErrorPage from '../pages/error_page/error_page';

const EhrWrapper = (): JSX.Element => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>();
    const [subspaceConfig, setSubspaceConfig] = useState<SubspaceConfig | null>(null);

    const setupSubspaceHandlers = useCallback((): SubspaceEventHandlers => {
        return {
            onPatientOpen: (context) => {
                console.log('Patient opened in Epic:', context);
                // You can update your app state here when Epic opens a patient
            },
            onPatientClose: (context) => {
                console.log('Patient closed in Epic:', context);
                // You can update your app state here when Epic closes a patient
            },
            onUserLogin: (context) => {
                console.log('User logged in to Epic:', context);
                // Handle user login events
            },
            onShutdown: (context) => {
                console.log('Epic shutting down:', context);
                // Handle Epic shutdown
            },
            onError: (errorMessage) => {
                console.error('Subspace error:', errorMessage);
                setError(`Subspace error: ${errorMessage}`);
            },
            onConnectionChange: (isConnected) => {
                console.log('Subspace connection status:', isConnected);
                if (subspaceConfig) {
                    setSubspaceConfig((prev) => (prev ? { ...prev, isSubscribed: isConnected } : null));
                }
            }
        };
    }, [subspaceConfig]);

    const initializeSubspace = useCallback(async (): Promise<void> => {
        try {
            // Extract Subspace parameters from launch
            const { hubUrl, hubTopic } = subspaceService.extractLaunchParams();

            if (!hubUrl || !hubTopic) {
                console.log('No Subspace parameters found - app launched without Subspace support');
                return; // This is OK, not all launches include Subspace
            }

            console.log('Subspace parameters found, setting up handlers...');
            subspaceService.setEventHandlers(setupSubspaceHandlers());

            console.log('Initializing Subspace...');
            const config = await subspaceService.initialize(hubUrl, hubTopic);
            setSubspaceConfig(config);

            console.log('Subspace initialized successfully');
        } catch (error) {
            console.error('Subspace initialization failed:', error);
            // Don't throw here - Subspace failure shouldn't prevent the app from working
            // Just log it and continue without Subspace functionality
            if (error instanceof Error && error.message.includes('JWT signing not implemented')) {
                console.warn('Subspace not available: JWT signing needs to be implemented');
            } else {
                setError(`Subspace setup failed: ${error instanceof Error ? error.message : String(error)}`);
            }
        }
    }, [setupSubspaceHandlers]);

    const smartLaunch = useCallback(async (): Promise<void> => {
        try {
            console.log('Starting SMART on FHIR launch...');
            await FHIR.oauth2.init({
                clientId: import.meta.env.VITE_APP_CLIENT_ID,
                scope: import.meta.env.VITE_APP_CLIENT_SCOPE,
                redirectUri: import.meta.env.VITE_APP_REDIRECT_URI
            });
            console.log('SMART on FHIR initialized successfully');
            // Try to initialize Subspace (optional)
            await initializeSubspace();
        } catch (e: any) {
            console.error('Error during SMART launch:', e);
            if (e instanceof Error) {
                setError(e.message);
            } else {
                setError(JSON.stringify(e));
            }
        }
        setLoading(false);
    }, [initializeSubspace]);

    useEffect(() => {
        smartLaunch();
        // Cleanup on unmount
        return () => {
            subspaceService.cleanup();
        };
    }, [smartLaunch]);

    const getContent = useCallback((): JSX.Element => {
        if (error) {
            return <ErrorPage message="Provider Standalone Launch failed" />;
        }
        if (loading) {
            return <CircularProgress size={92} />;
        }

        return <App />;
    }, [error, loading]);

    return (
        <StrictMode>
            <CssBaseline />
            {getContent()}
        </StrictMode>
    );
};

export default EhrWrapper;
