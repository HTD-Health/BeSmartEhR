import { Container, Typography } from '@mui/material';
import FHIR from 'fhirclient';
import { useEffect, useState } from 'react';

import App from 'app';

const StandaloneWrapper = (): JSX.Element => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);
    const [client, setClient] = useState<any>(null);

    useEffect(() => {
        console.log('client', client);
        if (client) return;
        smartLaunch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const smartLaunch = async (): Promise<void> => {
        try {
            const c = await FHIR.oauth2.init({
                // iss: process.env.REACT_APP_FHIR_URL,
                // clientId: process.env.REACT_APP_CLIENT_ID,
                // scope: process.env.REACT_APP_CLIENT_SCOPE,
                // redirectUri: process.env.REACT_APP_REDIRECT_URI
                iss: 'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4/',
                clientId: '9976354f-e38c-406e-9827-3b7ede3e2061',
                scope: 'launch patient/*.read openid profile fhirUser online_access',
                redirectUri: 'http://localhost:3000'
            });
            setLoading(false);
            console.log('- init', c);
            setClient(c);
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
