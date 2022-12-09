import { QueryClient } from 'react-query';
import type { Bundle, FhirResource } from 'fhir/r4';

import { getPatient, getUser, getQuestionnaires } from './api';

const getUserQuery = {
    queryKey: 'getUser',
    queryFn: getUser
};

const getPatientQuery = {
    queryKey: 'getPatient',
    queryFn: getPatient
};

type QuestionnairesQuery = {
    queryKey: (string | number)[];
    queryFn: () => Promise<Bundle<FhirResource>>;
    keepPreviousData: boolean;
};

const getQuestionnairesQuery = (
    queryClient: QueryClient,
    options: {
        page: number;
        questionnairesPerPage: number;
    }
): QuestionnairesQuery => ({
    queryKey: ['getQuestionnaires', options.page],
    queryFn: async () => {
        /* fetch the "bundleId" property from initial query (page=1) in case to get next/previous relation for pagination */
        const bundle: Bundle | undefined = queryClient.getQueryData(['getQuestionnaires', 1]);

        return getQuestionnaires(bundle?.id, options.page - 1, options.questionnairesPerPage);
    },
    keepPreviousData: true
});

export { getUserQuery, getPatientQuery, getQuestionnairesQuery };
