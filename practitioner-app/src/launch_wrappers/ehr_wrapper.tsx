import { CircularProgress } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import FHIR from 'fhirclient';
import { JSX, StrictMode, useCallback, useEffect, useState } from 'react';

import App from '@/app';
import ErrorPage from '../pages/error_page/error_page';

const EhrWrapper = (): JSX.Element => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>();

    const smartLaunch = useCallback(async (): Promise<void> => {
        try {
            console.log('Initializing SMART on FHIR client...');
            const client = await FHIR.oauth2.init({
                clientId: import.meta.env.VITE_APP_CLIENT_ID,
                scope: import.meta.env.VITE_APP_CLIENT_SCOPE,
                redirectUri: import.meta.env.VITE_APP_REDIRECT_URI
            });
            console.log('SMART on FHIR client initialized successfully.', client);
        } catch (e: any) {
            console.error('Error during SMART launch:', e);
            if (e instanceof Error) {
                setError(e.message);
            } else {
                setError(JSON.stringify(e));
            }
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        // smartLaunch();

        const doSmart = async () => {
            try {
                const client = await FHIR.oauth2.ready();
                console.log('SMART client ready:', client);
                setLoading(false);
            } catch (err) {
                console.log('Not ready, launching...');
                await FHIR.oauth2.authorize({
                    clientId: import.meta.env.VITE_APP_CLIENT_ID,
                    scope: import.meta.env.VITE_APP_CLIENT_SCOPE,
                    redirectUri: import.meta.env.VITE_APP_REDIRECT_URI
                });
                console.log('SMART client launched');
                setLoading(false);
            }
        };

        doSmart();
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
