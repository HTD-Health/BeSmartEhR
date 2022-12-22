import type { Bundle, FhirResource, Patient, Practitioner, Questionnaire } from 'fhir/r4';
import { useQuery, UseQueryResult } from 'react-query';

import { getPatient, getQuestionnaire, getQuestionnaires, getQuestionnaireTasks, getUser } from './api';
import { GetPaginetedRecordsParams } from './models';

const useGetPatient = (): UseQueryResult<Patient> => useQuery('getPatient', getPatient);

const useGetUser = (): UseQueryResult<Practitioner> => useQuery('getUser', getUser);

const useGetQuestionnaires = (params: GetPaginetedRecordsParams): UseQueryResult<Bundle<FhirResource>> =>
    useQuery(['getQuestionnaires', params.page], async () => getQuestionnaires(params), { keepPreviousData: true });

const useGetAssignedForms = (params: GetPaginetedRecordsParams): UseQueryResult<Bundle<FhirResource>> =>
    useQuery(['getAssignedForms', params.page], async () => getQuestionnaireTasks(params, false), {
        keepPreviousData: true
    });

const useGetFilledForms = (params: GetPaginetedRecordsParams): UseQueryResult<Bundle<FhirResource>> =>
    useQuery(['getFilledForms', params.page], async () => getQuestionnaireTasks(params, true), {
        keepPreviousData: true
    });

const useGetQuestionnaire = (id: string): UseQueryResult<Questionnaire> =>
    useQuery(['getQuestionnaire', id], async () => getQuestionnaire(id), { keepPreviousData: true });

export { useGetPatient, useGetUser, useGetQuestionnaires, useGetAssignedForms, useGetFilledForms, useGetQuestionnaire };
