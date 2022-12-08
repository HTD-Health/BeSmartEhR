import { Box, Pagination, Typography, Grid } from '@mui/material';
import { useQuery } from 'react-query';
import type { Questionnaire } from 'fhir/r4';
import { useState } from 'react';

import SmartAppBar from 'components/smart_app_bar/smart_app_bar';
import { getQuestionnaires } from 'api/api';
import QuestionnaireItem from 'components/questionnaire_item/questonnaire_item';

const FormsList = (): JSX.Element => {
    const QUESTIONNAIRES_PER_PAGE = 8;

    const [page, setPage] = useState(1);
    const { data } = useQuery(
        ['getQuestionnaires', page],
        () => getQuestionnaires(bundleId, page - 1, QUESTIONNAIRES_PER_PAGE),
        {
            keepPreviousData: true
        }
    );
    const bundleId: string | undefined = data?.id;

    const getTotalPagesCount = (): number => {
        if (data?.total) {
            return Math.floor(data.total / QUESTIONNAIRES_PER_PAGE) + 1;
        }
        return 0;
    };

    const handleChange = (_: React.ChangeEvent<unknown>, value: number): void => {
        setPage(value);
    };

    return (
        <>
            <SmartAppBar />
            <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12}>
                    <Box>
                        <Typography sx={{ ml: '.5rem', my: '1.5rem' }} variant="h4" color="inherit" noWrap>
                            Questionnaires
                        </Typography>
                        {data &&
                            data?.entry?.map((entryItem) => (
                                <QuestionnaireItem
                                    key={(entryItem.resource as Questionnaire).id}
                                    questionnaire={entryItem.resource as Questionnaire}
                                />
                            ))}
                    </Box>
                </Grid>
                <Grid item>
                    <Pagination
                        size="large"
                        sx={{}}
                        color="primary"
                        count={getTotalPagesCount()}
                        page={page}
                        onChange={handleChange}
                    />
                </Grid>
            </Grid>
        </>
    );
};

export default FormsList;
