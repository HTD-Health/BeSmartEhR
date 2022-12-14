import { Badge, Box, Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';

import { getPatientQuery, getTasksQuery } from 'api/queries';
import AlertSnackbar from 'components/error_snackbar/error_snackbar';
import PatientCard from 'components/patient_card/patient_card';
import SmartAppBar from 'components/smart_app_bar/smart_app_bar';

const Home = (): JSX.Element => {
    const [errorSnackbar, setErrorSnackbar] = useState('');
    const { error, data, isLoading } = useQuery(getPatientQuery);
    const { data: taskData, error: taskError } = useQuery(
        getTasksQuery(
            {
                status: 'ready'
            },
            0
        )
    );
    const navigate = useNavigate();

    useEffect(() => {
        if (error) {
            setErrorSnackbar('Failed to get patient data');
            console.error(error);
        }
    }, [error]);

    useEffect(() => {
        if (taskError) {
            setErrorSnackbar('Failed to get total tasks');
            console.error(taskError);
        }
    }, [taskError]);

    return (
        <>
            <SmartAppBar />
            <AlertSnackbar open={!!errorSnackbar} onClose={() => setErrorSnackbar('')} message={errorSnackbar} />
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
                                alignItems: 'stretch',
                                height: '100%'
                            }}
                        >
                            <Badge badgeContent={taskData?.total ?? 0} color="primary">
                                <Button
                                    variant="contained"
                                    onClick={() => navigate('/assigned-list')}
                                    sx={{ my: '0.5rem', width: '100%' }}
                                >
                                    Assigned Forms
                                </Button>
                            </Badge>
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
