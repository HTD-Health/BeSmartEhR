import { Box, Pagination } from '@mui/material';
import { useQuery } from 'react-query';
import type { Questionnaire } from 'fhir/r4';
import { useState } from 'react';

import SmartAppBar from 'components/smart_app_bar/smart_app_bar';
import { getQuestionnaires } from 'api/api';

const FormsList = (): JSX.Element => {
    const QUESTIONNAIRES_PER_PAGE = 4;

    const [page, setPage] = useState(1);
    const { isError, data } = useQuery(
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

    // const getQuestionnaireCard = (entry: Questionnaire): JSX.Element => <Box>{entry.name}</Box>;

    return (
        <>
            <SmartAppBar />
            <Box>{isError}</Box>
            {data && data?.entry?.map((x) => <Box key={x.id}>{(x.resource as Questionnaire).name}</Box>)}
            <Pagination color="secondary" count={getTotalPagesCount()} page={page} onChange={handleChange} />
        </>
    );
};

export default FormsList;
