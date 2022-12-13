import { useState, useEffect } from 'react';
import { Grid, Typography, Pagination } from '@mui/material';
import { useQuery } from 'react-query';

import AssignedFormsPage from './assigned_forms_page';

import SmartAppBar from 'components/smart_app_bar/smart_app_bar';
import AlertSnackbar from 'components/error_snackbar/error_snackbar';
import { getQuestionnairesAssignedToPatientQuery } from 'api/queries';

const AssignedFormsContainer = (): JSX.Element => {
    const [bundleId, setBundleId] = useState<string | undefined>(undefined);
    const [page, setPage] = useState(1);
    const [resultsInTotal, setResultsInTotal] = useState<number>(0);
    const [errorSnackbar, setErrorSnackbar] = useState<boolean>(false);

    const { data, isLoading, error } = useQuery(
        getQuestionnairesAssignedToPatientQuery(
            {
                bundleId,
                page,
                questionnairesPerPage: 5
            },
            setBundleId,
            setResultsInTotal
        )
    );

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
            <Typography sx={{ ml: '.5rem', my: '1.5rem' }} variant="h4" color="inherit" noWrap>
                Assigned Questionnaires
            </Typography>

            <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12}>
                    <AssignedFormsPage data={data} isLoading={isLoading} />
                </Grid>
                <Grid item>
                    <Pagination
                        size="large"
                        color="primary"
                        count={resultsInTotal}
                        page={page}
                        onChange={(_: React.ChangeEvent<unknown>, val: number) => setPage(val)}
                    />
                </Grid>
            </Grid>
        </>
    );
};

export default AssignedFormsContainer;
