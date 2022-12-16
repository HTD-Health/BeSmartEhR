import { useState, useEffect } from 'react';
import { Grid, Typography, Box, Pagination, CircularProgress } from '@mui/material';

import { useGetQuestionnaireResponse } from 'api/queries';
import SmartAppBar from 'components/smart_app_bar/smart_app_bar';
import QuestionnaireResponseResourceItem from 'components/questionnaire_item/questonnaire_response_item';
import CustomSnackbar from 'components/custom_snackbar/custom_snackbar';

const questionnairesResponsePerPage = 2;

const ResponsesContainer = (): JSX.Element => {
    const [bundleId] = useState<string | undefined>(undefined);
    const [page, setPage] = useState(1);
    const [errorSnackbar, setErrorSnackbar] = useState<boolean>(false);

    const {
        data,
        isLoading: isQueryLoading,
        error: queryError
    } = useGetQuestionnaireResponse({
        bundleId,
        page,
        questionnairesResponsePerPage
    });
    console.log(data);
    const count = Math.ceil((data?.entry?.length || 0) / questionnairesResponsePerPage);

    useEffect(() => {
        if (queryError) {
            setErrorSnackbar(true);
            console.error(queryError);
        }
    }, [queryError]);

    const renderPage = (): JSX.Element => (
        <Box>
            {data?.entry
                ?.filter((el) => el && el.resource)
                .map((el) => (
                    <QuestionnaireResponseResourceItem
                        key={el.resource?.id}
                        questionnaireResponse={el.resource as any}
                    />
                ))}
        </Box>
    );

    if (isQueryLoading) {
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
            <CustomSnackbar
                open={errorSnackbar}
                onClose={() => setErrorSnackbar(false)}
                message="Failed to get patient data"
            />
            <Typography sx={{ ml: '.5rem', my: '1.5rem' }} variant="h4" color="inherit" textAlign="center" noWrap>
                Patient Responses
            </Typography>
            {data?.entry?.length ? (
                <Grid container spacing={2} justifyContent="center" padding={2}>
                    <Grid item xs={12}>
                        {renderPage()}
                    </Grid>
                    <Grid item>
                        <Pagination
                            size="large"
                            color="primary"
                            count={count}
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
