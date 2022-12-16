import { useState, useEffect } from 'react';
import { Grid, Typography, Box, Pagination, CircularProgress } from '@mui/material';
import { useQuery } from 'react-query';

import SmartAppBar from 'components/smart_app_bar/smart_app_bar';
import AlertSnackbar from 'components/error_snackbar/error_snackbar';
import { getQuestionnairesQuery } from 'api/queries';
import QuestionnaireResourceItem from 'components/questionnaire_item/questonnaire_resource_item';

const ResponsesContainer = (): JSX.Element => {
    const [bundleId, setBundleId] = useState<string | undefined>(undefined);
    const [page, setPage] = useState(1);
    const [resultsInTotal, setResultsInTotal] = useState<number>(0);
    const [errorSnackbar, setErrorSnackbar] = useState<boolean>(false);

    const { data, isLoading, error } = useQuery(
        getQuestionnairesQuery(
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

    const renderPage = (): JSX.Element => (
        <Box padding={2}>
            {data?.entry
                ?.filter((el) => el && el.resource)
                .map((el) => (
                    <QuestionnaireResourceItem key={el.resource?.id} questionnaire={el.resource as any} />
                ))}
        </Box>
    );

    if (isLoading) {
        return (
            <>
                <SmartAppBar />
                <CircularProgress />
            </>
        );
    }
    return (
        <>
            <SmartAppBar />
            <AlertSnackbar
                open={errorSnackbar}
                onClose={() => setErrorSnackbar(false)}
                message="Failed to get patient data"
            />
            <Typography sx={{ ml: '.5rem', my: '1.5rem' }} variant="h4" color="inherit" textAlign="center" noWrap>
                Patient Responses
            </Typography>
            {data?.entry?.length ? (
                <Grid container spacing={2} justifyContent="center">
                    <Grid item xs={12}>
                        {renderPage()}
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
            ) : (
                <Typography variant="h6" color="inherit" textAlign="center" noWrap>
                    There are no responses.
                </Typography>
            )}
        </>
    );
};

export default ResponsesContainer;
