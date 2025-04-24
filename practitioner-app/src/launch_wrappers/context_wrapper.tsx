import { CircularProgress } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import FHIR from 'fhirclient';
import { StrictMode, useCallback, useEffect, useState } from 'react';

import ErrorPage from '../pages/error_page/error_page';

import App from 'app';

declare global {
    interface Window {
        FHIRClient?: any;
        patientResource?: any;
    }
}

const ContextWrapper = (): JSX.Element => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>();

    const contextLaunch = useCallback(async (): Promise<void> => {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const contextParam = urlParams.get('context');

            if (!contextParam) {
                throw new Error('Missing context parameter');
            }

            const context = JSON.parse(decodeURIComponent(contextParam));

            const client = FHIR.client({
                serverUrl: context.fhirServer,
                tokenResponse: {
                    patient: context.context.patientId
                }
            });

            window.FHIRClient = client;

            if (context.prefetch?.patient) {
                window.patientResource = context.prefetch.patient;
            }
        } catch (e: any) {
            console.error('Error during CDS Hooks launch:', e);
            if (e instanceof Error) {
                setError(e.message);
            } else {
                setError(JSON.stringify(e));
            }
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        contextLaunch();
    }, [contextLaunch]);

    const getContent = useCallback((): JSX.Element => {
        if (error) {
            return <ErrorPage message="Context Launch failed" />;
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

export default ContextWrapper;
