import { Pagination, Typography, Grid, CircularProgress } from '@mui/material';
import { useQuery } from 'react-query';
import type { Questionnaire } from 'fhir/r4';
import { useState } from 'react';

import SmartAppBar from 'components/smart_app_bar/smart_app_bar';
import { getQuestionnaires } from 'api/api';
import QuestionnaireItem from 'components/questionnaire_item/questonnaire_item';

const FormsList = (): JSX.Element => {
    // currently defined as constant in forms_list.tsx
    const QUESTIONNAIRES_PER_PAGE = 8;

    const [page, setPage] = useState(1);
    const { data, isLoading } = useQuery(
        ['getQuestionnaires', page],
        () => getQuestionnaires(bundleId, page - 1, QUESTIONNAIRES_PER_PAGE),
        {
            keepPreviousData: true
        }
    );
    const bundleId: string | undefined = data?.id;

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

    return (
        <>
            <SmartAppBar />
            {renderTitle()}
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
        </>
    );
};

export default FormsList;
