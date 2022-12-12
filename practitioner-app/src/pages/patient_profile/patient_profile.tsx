import { Box, Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';

import PatientCard from 'components/patient_card/patient_card';
import SmartAppBar from 'components/smart_app_bar/smart_app_bar';
import ErrorSnackbar from 'components/error_snackbar/error_snackbar';
import { getPatientQuery } from 'api/queries';
import { assignForms } from 'api/api';

const PatientProfile = (): JSX.Element => {
    const [errorSnackbar, setErrorSnackbar] = useState(false);
    const { error, data, isLoading } = useQuery(getPatientQuery);

    useEffect(() => {
        if (error) {
            setErrorSnackbar(true);
            console.error(error);
        }
    }, [error]);

    // TODO: Its just an example of assigning a hardcoded form, actual assignment shall be added when Questionnaires list is implemented
    const assignExampleForm = async (): Promise<void> => {
        const response = await assignForms([
            { id: '1444945', name: 'First questionnaire' },
            { id: '1444946', name: 'second questionnaire' }
        ]);
        console.log(response);
    };

    return (
        <>
            <SmartAppBar />
            <ErrorSnackbar
                open={errorSnackbar}
                onClose={() => setErrorSnackbar(false)}
                message="Failed to get patient data"
            />
            <Box
                sx={{
                    p: '2rem'
                }}
            >
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                height: '100%'
                            }}
                        >
                            <PatientCard patient={data} isLoading={isLoading} />
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                height: '100%'
                            }}
                        >
                            <Button variant="contained" sx={{ my: '0.5rem' }}>
                                Assigned Forms
                            </Button>
                            <Button variant="contained" sx={{ my: '0.5rem' }}>
                                Filled Forms
                            </Button>
                            <Button variant="contained" sx={{ my: '0.5rem' }} onClick={assignExampleForm}>
                                Assign a new Form
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};

export default PatientProfile;
