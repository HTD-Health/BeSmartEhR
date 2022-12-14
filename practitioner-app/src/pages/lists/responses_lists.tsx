import { useQuery } from 'react-query';
import { useState } from 'react';

import { getPatientQuery, getQuestionnairesQuery } from 'api/queries';

const ResponsesLists = (): JSX.Element => {
    const [d1, setD1] = useState<string | undefined>(undefined);
    const [d2, setD2] = useState<number>(0);

    const options = {
        bundleId: undefined,
        page: d2,
        questionnairesPerPage: 10
    };
    const { queryKey, queryFn, onSuccess } = getQuestionnairesQuery(options, setD1, setD2);

    const { error, data, isLoading } = useQuery(queryKey);
    return <></>;
};
export default ResponsesLists;
