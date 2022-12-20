import { Box, Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useGetPatient } from 'api/queries';
import CustomSnackbar from 'components/custom_snackbar/custom_snackbar';
import PatientCard from 'components/patient_card/patient_card';
import SmartAppBar from 'components/smart_app_bar/smart_app_bar';
import routes from 'routes';

const PatientProfile = (): JSX.Element => {
    const [errorSnackbar, setErrorSnackbar] = useState(false);
    const { error, data, isLoading } = useGetPatient();
    const navigate = useNavigate();

    useEffect(() => {
        if (error) {
            setErrorSnackbar(true);
            console.error(error);
        }
    }, [error]);

    return (
        <>
            <SmartAppBar />
            <CustomSnackbar
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
                            <Button
                                variant="contained"
                                sx={{ my: '0.5rem' }}
                                onClick={() => navigate(routes.assignedForms)}
                            >
                                Assigned Forms
                            </Button>
                            <Button
                                variant="contained"
                                sx={{ my: '0.5rem' }}
                                onClick={() => navigate(routes.filledForms)}
                            >
                                Filled Forms
                            </Button>
                            <Button
                                variant="contained"
                                sx={{ my: '0.5rem' }}
                                onClick={() => navigate(routes.formsList)}
                            >
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
