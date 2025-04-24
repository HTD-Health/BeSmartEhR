import { CircularProgress } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import FHIR from 'fhirclient';
import React, { useCallback, useEffect, useState } from 'react';

import ErrorPage from '../pages/error_page/error_page';

import App from 'app';

const EhrWrapper = (): JSX.Element => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>();

    const smartLaunch = useCallback(async (): Promise<void> => {
        try {
            await FHIR.oauth2.init({
                clientId: process.env.REACT_APP_CLIENT_ID,
                scope: process.env.REACT_APP_CLIENT_SCOPE,
                redirectUri: process.env.REACT_APP_REDIRECT_URI
            });
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
        smartLaunch();
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
        <React.StrictMode>
            <CssBaseline />
            {getContent()}
        </React.StrictMode>
    );
};

export default EhrWrapper;
