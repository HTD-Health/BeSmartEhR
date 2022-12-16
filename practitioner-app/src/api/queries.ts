import type { Bundle, FhirResource, Patient, Practitioner, Questionnaire } from 'fhir/r4';
import { useQuery, UseQueryResult } from 'react-query';

import { getPatient, getUser, getQuestionnaires, getQuestionnaireResponse, getQuestionnaire } from './api';
import { GetQuestionnairesParams, GetQuestionnaireResponseParams, GetQuestionnaireParams } from './models';

const useGetPatient = (): UseQueryResult<Patient> => useQuery('getPatient', getPatient);

const useGetUser = (): UseQueryResult<Practitioner> => useQuery('getUser', getUser);

const useGetQuestionnaire = (params: GetQuestionnaireParams): UseQueryResult<Questionnaire> =>
    useQuery(['getQuestionnaire', params.id], async () => getQuestionnaire(params));

const useGetQuestionnaires = (params: GetQuestionnairesParams): UseQueryResult<Bundle<FhirResource>> =>
    useQuery(['getQuestionnaires', params.page], async () => getQuestionnaires(params), { keepPreviousData: true });

const useGetQuestionnaireResponse = (params: GetQuestionnaireResponseParams): UseQueryResult<Bundle<FhirResource>> =>
    useQuery(['getQuestionnaireResponse', params.page], async () => getQuestionnaireResponse(params), {
        keepPreviousData: true
    });

export { useGetPatient, useGetUser, useGetQuestionnaires, useGetQuestionnaireResponse, useGetQuestionnaire };
