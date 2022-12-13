import type { Bundle, FhirResource, Patient, Practitioner } from 'fhir/r4';
import { Dispatch, SetStateAction } from 'react';
import { useQuery, UseQueryResult } from 'react-query';

import { getPatient, getUser, getQuestionnaires } from './api';

const useGetPatient = (): UseQueryResult<Patient> => useQuery('getPatient', getPatient);

const useGetUser = (): UseQueryResult<Practitioner> => useQuery('getUser', getUser);

const useGetQuestionnaires = (
    options: {
        bundleId: string | undefined;
        page: number;
        questionnairesPerPage: number;
    },
    setBundleId: Dispatch<SetStateAction<string | undefined>>,
    setResultsInTotal: Dispatch<SetStateAction<number>>
): UseQueryResult<Bundle<FhirResource>> =>
    useQuery(
        ['getQuestionnaires', options.page],
        async () => getQuestionnaires(options.bundleId, options.page - 1, options.questionnairesPerPage),
        {
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
        }
    );

export { useGetPatient, useGetUser, useGetQuestionnaires };
