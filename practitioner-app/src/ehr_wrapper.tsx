import React, { useEffect, useState } from 'react';
import { Container, Typography } from '@mui/material';
import FHIR from 'fhirclient';
import CssBaseline from '@mui/material/CssBaseline';

import App from 'app';

const EhrWrapper = (): JSX.Element => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        smartLaunch();
    }, []);

    const smartLaunch = async (): Promise<void> => {
        try {
            await FHIR.oauth2.init({
                clientId: process.env.REACT_APP_CLIENT_ID,
                scope: process.env.REACT_APP_CLIENT_SCOPE,
                redirectUri: process.env.REACT_APP_REDIRECT_URI,
            });
            setLoading(false);
        } catch (e: any) {
            setError(e);
        }
    };

    const getContent = (): JSX.Element => {
        if (error) {
            return (
                <Container>
                    <Typography variant="h5">Provider Standalone Launch failed</Typography>
                    <Typography variant="body1">error: {error}</Typography>
                </Container>
            );
        }
        if (loading) {
            return (
                <Container>
                    <Typography variant="body1">Loading...</Typography>
                </Container>
            );
        }

        return <App />;
    };

    return (
        <React.StrictMode>
            <CssBaseline />
            {getContent()}
        </React.StrictMode>
    );
};

export default EhrWrapper;
