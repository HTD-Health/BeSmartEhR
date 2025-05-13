import type { Bundle, FhirResource, Patient, Practitioner, Questionnaire, QuestionnaireResponse } from 'fhir/r4';

import { keepPreviousData, useQuery, UseQueryResult } from '@tanstack/react-query';
import {
    addGoal,
    getAllergies,
    getConditions,
    getGoals,
    getMedications,
    getPatient,
    getQuestionnaire,
    getQuestionnaires,
    getQuestionnaireTasks,
    getResponse,
    getUser
} from './api';
import { GetPaginatedRecordsParams } from './models';

const useGetPatient = (): UseQueryResult<Patient> => useQuery({ queryKey: ['getPatient'], queryFn: getPatient });

const useGetUser = (): UseQueryResult<Practitioner> => useQuery({ queryKey: ['getUser'], queryFn: getUser });

const useGetConditions = (): UseQueryResult<Bundle<FhirResource>> =>
    useQuery({ queryKey: ['getConditions'], queryFn: getConditions, placeholderData: keepPreviousData });

const useGetQuestionnaires = (params: GetPaginatedRecordsParams): UseQueryResult<Bundle<FhirResource>> =>
    useQuery({
        queryKey: ['getQuestionnaires', params],
        queryFn: async () => getQuestionnaires(params),
        placeholderData: keepPreviousData
    });

const useGetAssignedForms = (params: GetPaginatedRecordsParams): UseQueryResult<Bundle<FhirResource>> =>
    useQuery({
        queryKey: ['getAssignedForms', params],
        queryFn: async () => getQuestionnaireTasks(params, false),
        placeholderData: keepPreviousData
    });

const useGetFilledForms = (params: GetPaginatedRecordsParams): UseQueryResult<Bundle<FhirResource>> =>
    useQuery({
        queryKey: ['getFilledForms', params],
        queryFn: async () => getQuestionnaireTasks(params, true),
        placeholderData: keepPreviousData
    });

const useGetResponse = (responseId: string): UseQueryResult<QuestionnaireResponse> =>
    useQuery({
        queryKey: ['getResponse', responseId],
        queryFn: async () => getResponse(responseId),
        placeholderData: keepPreviousData
    });

const useGetQuestionnaire = (id?: string): UseQueryResult<Questionnaire> =>
    useQuery({
        queryKey: ['getQuestionnaire', id],
        queryFn: async () => getQuestionnaire(id),
        placeholderData: keepPreviousData,
        enabled: !!id
    });

const useGetGoals = (): UseQueryResult<Bundle<FhirResource>> =>
    useQuery({ queryKey: ['getGoals'], queryFn: async () => getGoals(), placeholderData: keepPreviousData });

const useAddGoal = (description: string): UseQueryResult<Bundle<FhirResource>> =>
    useQuery({
        queryKey: ['addGoal', description],
        queryFn: async () => addGoal(description),
        placeholderData: keepPreviousData
    });

const useGetMedications = (): UseQueryResult<Bundle<FhirResource>> =>
    useQuery({ queryKey: ['getMedications'], queryFn: getMedications, placeholderData: keepPreviousData });

const useGetAllergies = (): UseQueryResult<Bundle<FhirResource>> =>
    useQuery({ queryKey: ['getAllergies'], queryFn: getAllergies, placeholderData: keepPreviousData });

export {
    useAddGoal,
    useGetAllergies,
    useGetAssignedForms,
    useGetConditions,
    useGetFilledForms,
    useGetGoals,
    useGetMedications,
    useGetPatient,
    useGetQuestionnaire,
    useGetQuestionnaires,
    useGetResponse,
    useGetUser
};
