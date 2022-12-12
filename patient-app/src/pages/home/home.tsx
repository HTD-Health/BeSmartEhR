import { Box, Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';

import { getPatientQuery } from 'api/queries';
import AlertSnackbar from 'components/error_snackbar/error_snackbar';
import PatientCard from 'components/patient_card/patient_card';
import SmartAppBar from 'components/smart_app_bar/smart_app_bar';

const Home = (): JSX.Element => {
    const [errorSnackbar, setErrorSnackbar] = useState(false);
    const { error, data, isLoading } = useQuery(getPatientQuery);
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
            <AlertSnackbar
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
                                onClick={() => navigate('/assigned-list')}
                                sx={{ my: '0.5rem' }}
                            >
                                Assigned Forms
                            </Button>
                            <Button variant="contained" onClick={() => navigate('/filled-list')} sx={{ my: '0.5rem' }}>
                                Filled Forms
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};

export default Home;