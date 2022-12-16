/* eslint-disable no-unused-vars */
import { useQuery } from 'react-query';
import { useState } from 'react';
import { Box, CircularProgress } from '@mui/material';

import { getQuestionnairesQuery } from 'api/queries';
import QuestionnaireResourceItem from 'components/questionnaire_item/questonnaire_resource_item';
import SmartAppBar from 'components/smart_app_bar/smart_app_bar';

const ResponsesLists = (): JSX.Element => {
    const [d1, setD1] = useState<string | undefined>(undefined);
    const [d2, setD2] = useState<number>(0);

    const options = {
        bundleId: undefined,
        page: d2,
        questionnairesPerPage: 10
    };
    const { queryKey, queryFn, onSuccess } = getQuestionnairesQuery(options, setD1, setD2);

    const { error, data, isLoading } = useQuery(queryKey, queryFn);

    if (isLoading) {
        return <CircularProgress />;
    }
    console.log(data);
    return (
        <>
            <SmartAppBar />
            <Box padding={2}>
                {data?.entry
                    ?.filter((el) => el && el.resource)
                    .map((el) => (
                        <QuestionnaireResourceItem key={el.resource?.id} questionnaire={el.resource as any} />
                    ))}
            </Box>
        </>
    );
};
export default ResponsesLists;
