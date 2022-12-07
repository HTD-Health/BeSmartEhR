import { Container, Typography } from '@mui/material';
import FHIR from 'fhirclient';
import { useEffect, useState } from 'react';

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
                scope: process.env.REACT_APP_CLIENT_SCOPE
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

    return <App />;
};

export default EhrWrapper;
