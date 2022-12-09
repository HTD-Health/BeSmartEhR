import { Pagination, Typography, Grid, CircularProgress } from '@mui/material';
import { useQuery, useQueryClient } from 'react-query';
import type { Questionnaire } from 'fhir/r4';
import { useState, useEffect } from 'react';

import QuestionnaireItem from 'components/questionnaire_item/questonnaire_item';
import { getQuestionnairesQuery } from 'api/queries';
import SmartAppBar from 'components/smart_app_bar/smart_app_bar';
import AlertSnackbar from 'components/error_snackbar/error_snackbar';

const QUESTIONNAIRES_PER_PAGE = 5;

const FormsList = (): JSX.Element => {
    const [page, setPage] = useState(1);
    const [errorSnackbar, setErrorSnackbar] = useState(false);

    const queryClient = useQueryClient();

    const { data, isLoading, error } = useQuery(
        getQuestionnairesQuery(queryClient, {
            page,
            questionnairesPerPage: QUESTIONNAIRES_PER_PAGE
        })
    );

    useEffect(() => {
        if (error) {
            setErrorSnackbar(true);
            console.error(error);
        }
    }, [error]);

    const getTotalPagesCount = (): number => {
        if (data?.total) {
            const pages = Math.floor(data.total / QUESTIONNAIRES_PER_PAGE);
            return data.total % QUESTIONNAIRES_PER_PAGE ? pages + 1 : pages;
        }
        return 0;
    };

    const renderTitle = (): JSX.Element => (
        <Typography sx={{ ml: '.5rem', my: '1.5rem' }} variant="h4" color="inherit" noWrap>
            Questionnaires
        </Typography>
    );

    const renderContent = (): JSX.Element => {
        if (isLoading) {
            return <CircularProgress sx={{ m: '2rem' }} />;
        }

        if (!data || !Array.isArray(data.entry) || data.entry.length === 0) {
            return (
                <Typography sx={{ ml: '.5rem' }} variant="h6">
                    No questionnaires found
                </Typography>
            );
        }

        return (
            <>
                {data?.entry?.map((entryItem) => (
                    <QuestionnaireItem
                        key={(entryItem.resource as Questionnaire).id}
                        questionnaire={entryItem.resource as Questionnaire}
                    />
                ))}
            </>
        );
    };

    const renderPagination = (): JSX.Element => (
        <Pagination
            size="large"
            color="primary"
            count={getTotalPagesCount()}
            page={page}
            onChange={(_: React.ChangeEvent<unknown>, value: number) => setPage(value)}
        />
    );

    return (
        <>
            <SmartAppBar />
            <AlertSnackbar
                open={errorSnackbar}
                onClose={() => setErrorSnackbar(false)}
                message="Failed to get patient data"
            />
            {renderTitle()}
            <Grid container spacing={2} justifyContent="center">
                <>
                    <Grid item xs={12}>
                        {renderContent()}
                    </Grid>
                    <Grid item>{renderPagination()}</Grid>
                </>
            </Grid>
        </>
    );
};

export default FormsList;
