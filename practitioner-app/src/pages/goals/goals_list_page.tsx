import { Button, Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

import { useGetGoals } from 'api/queries';
import CustomSnackbar from 'components/custom_snackbar/custom_snackbar';
import SmartAppBar from 'components/smart_app_bar/smart_app_bar';
import { useCreateGoal } from 'api/mutations';

const GoalsListPage = (): JSX.Element => {
    const [newGoal, setNewGoal] = useState<string>('');
    const [errorSnackbar, setErrorSnackbar] = useState<boolean>(false);

    const { data, isLoading, error, isSuccess } = useGetGoals()
    const { mutate: createGoal, error: goalCreateError, isLoading: goalCreateIsLoading, isSuccess: goalCreateSuccess } = useCreateGoal();
    
    console.log(`Get Goals: loading-${isLoading}, error-${error}, success-${isSuccess}`);
    console.log(`Create Goal: loading-${goalCreateIsLoading}, error-${goalCreateError}, success-${goalCreateSuccess}`);

    const handleAddGoal = (): void => {
        console.log(`Adding goal: ${newGoal}`);
        createGoal(newGoal);
    }
        
    useEffect(() => {
        if (error) {
            setErrorSnackbar(true);
            console.error(error);
        }
        if (goalCreateError) {
            setErrorSnackbar(true);
            console.error(goalCreateError);
        }
    }, [error]);
    
    return (
        <>
            <SmartAppBar />
            <CustomSnackbar
                open={errorSnackbar}
                onClose={() => setErrorSnackbar(false)}
                message="Failed to get patient goals"
            />
            <Typography sx={{ ml: '.5rem', my: '1.5rem' }} variant="h4" color="inherit" noWrap>
                Patient Goals
            </Typography>
            <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12}>
                    {
                        data && Array.isArray(data) ? data.map((goal: any) => (
                            <Typography key={goal.id}>{goal?.description?.text}</Typography>
                        )) : <Typography>No goals found</Typography>
                    }
                </Grid>

                <Grid item xs={12}>
                    <h3>Add Goal</h3>
                    <input type="text" onChange={e => setNewGoal(e.target.value)} />
                    <Button onClick={handleAddGoal}>Add</Button>
                </Grid>
            </Grid>
        </>
    );
};

export default GoalsListPage;
