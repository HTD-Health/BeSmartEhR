import { Pagination, Typography, Grid, CircularProgress } from '@mui/material';
import { useQuery } from 'react-query';
import type { Questionnaire } from 'fhir/r4';
import { useState, useEffect, useContext } from 'react';

import QuestionnaireItem from 'components/questionnaire_item/questonnaire_item';
import { getQuestionnairesQuery } from 'api/queries';
import { FormsContext } from 'hooks/useFormsData';

const QUESTIONNAIRES_PER_PAGE = 5;

const FormsPage = (): JSX.Element => {
    const [page, setPage] = useState(1);
    const [bundleId, setBundleId] = useState<string | undefined>(undefined);
    const { setErrorSnackbar } = useContext(FormsContext);

    const { data, isLoading, error } = useQuery(
        getQuestionnairesQuery(
            {
                bundleId,
                page,
                questionnairesPerPage: QUESTIONNAIRES_PER_PAGE
            },
            setBundleId
        )
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

    return (
        <Grid container spacing={2} justifyContent="center">
            <>
                <Grid item xs={12}>
                    {renderContent()}
                </Grid>
                <Grid item>
                    <Pagination
                        size="large"
                        color="primary"
                        count={getTotalPagesCount()}
                        page={page}
                        onChange={(_: React.ChangeEvent<unknown>, value: number) => setPage(value)}
                    />
                </Grid>
            </>
        </Grid>
    );
};

export default FormsPage;
