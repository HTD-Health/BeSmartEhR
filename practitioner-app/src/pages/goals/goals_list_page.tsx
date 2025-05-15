import { Box, Button, Grid2, Typography } from '@mui/material';
import { JSX, useEffect, useState } from 'react';

import { useCreateGoal } from '@/api/mutations';
import { useGetGoals } from '@/api/queries';
import CustomSnackbar from '@/components/custom_snackbar/custom_snackbar';
import SmartAppBar from '@/components/smart_app_bar/smart_app_bar';

const GoalsListPage = (): JSX.Element => {
    const [newGoal, setNewGoal] = useState<string>('');
    const [errorSnackbar, setErrorSnackbar] = useState<boolean>(false);

    const { data, isLoading, error, isSuccess } = useGetGoals();
    const {
        mutate: createGoal,
        error: goalCreateError,
        isPending: goalCreateIsPending,
        isSuccess: goalCreateSuccess
    } = useCreateGoal();

    console.info(`Get Goals: loading-${isLoading}, error-${error}, success-${isSuccess}`);
    console.info(`Create Goal: loading-${goalCreateIsPending}, error-${goalCreateError}, success-${goalCreateSuccess}`);

    const handleAddGoal = (): void => {
        createGoal(newGoal);
    };

    useEffect(() => {
        if (error) {
            setErrorSnackbar(true);
            console.error(error);
        }
        if (goalCreateError) {
            setErrorSnackbar(true);
            console.error(goalCreateError);
        }
    }, [error, goalCreateError]);

    return (
        <>
            <SmartAppBar />
            <CustomSnackbar
                open={errorSnackbar}
                onClose={() => setErrorSnackbar(false)}
                message="Failed to get patient goals"
            />
            <Box sx={{ p: '2rem' }}>
                <Typography sx={{ ml: '.5rem', my: '1.5rem' }} variant="h4" color="inherit" noWrap>
                    Patient Goals
                </Typography>
                <Grid2 container spacing={2} justifyContent="center">
                    <Grid2 size={12}>
                        {data && Array.isArray(data) ? (
                            data.map((goal: any) => <Typography key={goal.id}>{goal?.description?.text}</Typography>)
                        ) : (
                            <Typography>No goals found</Typography>
                        )}
                    </Grid2>

                    <Grid2 size={12}>
                        <h3>Add Goal</h3>
                        <input type="text" onChange={(e) => setNewGoal(e.target.value)} />
                        <Button loading={goalCreateIsPending} onClick={handleAddGoal}>
                            Add
                        </Button>
                    </Grid2>
                </Grid2>
            </Box>
        </>
    );
};

export default GoalsListPage;
