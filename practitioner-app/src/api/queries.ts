import type { Bundle, FhirResource } from 'fhir/r4';
import { Dispatch, SetStateAction } from 'react';

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
    setBundleId: Dispatch<SetStateAction<string | undefined>>,
    setResultsInTotal: Dispatch<SetStateAction<number>>
): QuestionnairesQuery => ({
    queryKey: ['getQuestionnaires', options.page],
    queryFn: async () => getQuestionnaires(options.bundleId, options.page - 1, options.questionnairesPerPage),
    onSuccess: (data: Bundle) => {
        if (data?.total && options.page === 1) {
            const pages = Math.floor(data.total / options.questionnairesPerPage);
            const total = data.total % options.questionnairesPerPage ? pages + 1 : pages;
            setResultsInTotal(total);
            setBundleId(data?.id);
        }
        return data;
    },
    keepPreviousData: true
});

export { getUserQuery, getPatientQuery, getQuestionnairesQuery };
