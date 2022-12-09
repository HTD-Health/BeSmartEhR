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
    onSuccess: (data: Bundle) => Bundle;
};

const getQuestionnairesQuery = (
    options: {
        bundleId: string | undefined;
        page: number;
        questionnairesPerPage: number;
    },
    setBundleId: React.Dispatch<React.SetStateAction<string | undefined>>
): QuestionnairesQuery => ({
    queryKey: ['getQuestionnaires', options.page],
    queryFn: async () => getQuestionnaires(options.bundleId, options.page - 1, options.questionnairesPerPage),
    onSuccess: (data: Bundle) => {
        setBundleId(data?.id);
        return data;
    },
    keepPreviousData: true
});

export { getUserQuery, getPatientQuery, getQuestionnairesQuery };
