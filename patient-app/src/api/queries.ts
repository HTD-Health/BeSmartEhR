import type { Bundle, FhirResource, Questionnaire, QuestionnaireResponse } from 'fhir/r4';
import { useQuery, UseQueryResult } from 'react-query';

import { getPatient, getQuestionnaire, getResponse, getTasks, getUser, PaginationParams, TaskParams } from './api';

const getUserQuery = {
    queryKey: 'getUser',
    queryFn: getUser
};

const getPatientQuery = {
    queryKey: 'getPatient',
    queryFn: getPatient
};

type QueryParams = {
    queryKey: (string | number)[];
    queryFn: () => Promise<Bundle<FhirResource>>;
    keepPreviousData: boolean;
};

const getTasksQuery = (params: TaskParams, count: number, pagination?: PaginationParams): QueryParams => ({
    queryKey: ['getTasks', params.status, pagination?.page ?? ''],
    queryFn: async () => getTasks(params, count, pagination),
    keepPreviousData: true
});

const useGetResponse = (responseId: string): UseQueryResult<QuestionnaireResponse> =>
    useQuery(['getResponse', responseId], async () => getResponse(responseId), {
        keepPreviousData: true
    });

const useGetQuestionnaire = (id?: string): UseQueryResult<Questionnaire> =>
    useQuery(['getQuestionnaire', id], async () => getQuestionnaire(id), { keepPreviousData: true, enabled: !!id });

export { getUserQuery, getPatientQuery, getTasksQuery, useGetResponse, useGetQuestionnaire };
