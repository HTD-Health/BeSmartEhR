import type { Bundle, FhirResource, Patient, Practitioner, Questionnaire, QuestionnaireResponse } from 'fhir/r4';
import { useQuery, UseQueryResult } from 'react-query';

import { addGoal, getAllergies, getConditions, getGoals, getMedications, getPatient, getQuestionnaire, getQuestionnaires, getQuestionnaireTasks, getResponse, getUser } from './api';
import { GetPaginatedRecordsParams } from './models';

const useGetPatient = (): UseQueryResult<Patient> => useQuery('getPatient', getPatient);

const useGetUser = (): UseQueryResult<Practitioner> => useQuery('getUser', getUser);

const useGetConditions = (): UseQueryResult<Bundle<FhirResource>> =>
    useQuery(['getConditions'], getConditions, { keepPreviousData: true });

const useGetQuestionnaires = (params: GetPaginatedRecordsParams): UseQueryResult<Bundle<FhirResource>> =>
    useQuery(['getQuestionnaires', params.page], async () => getQuestionnaires(params), { keepPreviousData: true });

const useGetAssignedForms = (params: GetPaginatedRecordsParams): UseQueryResult<Bundle<FhirResource>> =>
    useQuery(['getAssignedForms', params.page], async () => getQuestionnaireTasks(params, false), {
        keepPreviousData: true
    });

const useGetFilledForms = (params: GetPaginatedRecordsParams): UseQueryResult<Bundle<FhirResource>> =>
    useQuery(['getFilledForms', params.page], async () => getQuestionnaireTasks(params, true), {
        keepPreviousData: true
    });

const useGetResponse = (responseId: string): UseQueryResult<QuestionnaireResponse> =>
    useQuery(['getResponse', responseId], async () => getResponse(responseId), {
        keepPreviousData: true
    });

const useGetQuestionnaire = (id?: string): UseQueryResult<Questionnaire> =>
    useQuery(['getQuestionnaire', id], async () => getQuestionnaire(id), { keepPreviousData: true, enabled: !!id });

const useGetGoals = (): UseQueryResult<Bundle<FhirResource>> =>
    useQuery(['getGoals'], async () => getGoals(), { keepPreviousData: true });

const useAddGoal = (description: string): UseQueryResult<Bundle<FhirResource>> =>
    useQuery(['addGoal'], async () => addGoal(description), { keepPreviousData: true });

const useGetMedications = (): UseQueryResult<Bundle<FhirResource>> =>
    useQuery(['getMedications'], getMedications, { keepPreviousData: true });

const useGetAllergies = (): UseQueryResult<Bundle<FhirResource>> =>
    useQuery(['getAllergies'], getAllergies, { keepPreviousData: true });

export {
    useGetPatient,
    useGetUser,
    useGetConditions,
    useGetQuestionnaires,
    useGetQuestionnaire,
    useGetAssignedForms,
    useGetFilledForms,
    useGetResponse,
    useGetGoals,
    useAddGoal,
    useGetMedications,
    useGetAllergies
};
