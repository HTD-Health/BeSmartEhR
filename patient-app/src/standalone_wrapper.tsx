import { Container, Typography } from '@mui/material';
import FHIR from 'fhirclient';
import { useEffect, useRef, useState } from 'react';

import App from 'app';

const StandaloneWrapper = (): JSX.Element => {
    const initialized = useRef(true); // Check if react already rendered this component

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        // Epic does not allow init twice (token request returns 400)
        // React in development renders twice (StrictMode) so we need a flag
        if (initialized.current) {
            initialized.current = false;
            return;
        }
        smartLaunch();
    }, []);

    const smartLaunch = async (): Promise<void> => {
        try {
            await FHIR.oauth2.init({
                iss: process.env.REACT_APP_FHIR_URL,
                clientId: process.env.REACT_APP_CLIENT_ID,
                scope: process.env.REACT_APP_CLIENT_SCOPE,
                redirectUri: process.env.REACT_APP_REDIRECT_URI
            });
            setLoading(false);
        } catch (e: any) {
            setError(e);
        }
    };

    if (error) {
        return (
            <Container>
                <Typography variant="h5">Patient Standalone Launch failed</Typography>
                <Typography variant="body1">error: {JSON.stringify(error)}</Typography>
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

export default StandaloneWrapper;
