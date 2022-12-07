import { Container, Typography } from '@mui/material';
import AppRouter from 'app_router';
import FHIR from 'fhirclient';
import { useEffect, useState } from 'react';

const EhrWrapper = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        smartLaunch();
    }, []);

    const smartLaunch = async () => {
        try {
            await FHIR.oauth2.init({
                clientId: process.env.REACT_APP_CLIENT_ID,
                scope: process.env.REACT_APP_CLIENT_SCOPE,
                iss: process.env.REACT_APP_FHIR_SERVER // TODO: do not commit this
            });
            setLoading(false);
        } catch (e: any) {
            setError(e);
        }
    };

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

    return <AppRouter />;
};

export default EhrWrapper;
