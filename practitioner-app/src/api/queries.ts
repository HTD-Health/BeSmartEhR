import type { Bundle, FhirResource, Patient, Practitioner, Questionnaire } from 'fhir/r4';
import { useQuery, UseQueryResult } from 'react-query';

import { getFormAssignments, getPatient, getQuestionnaire, getQuestionnaires, getUser } from './api';
import { GetPaginetedRecordsParams } from './models';

const useGetPatient = (): UseQueryResult<Patient> => useQuery('getPatient', getPatient);

const useGetUser = (): UseQueryResult<Practitioner> => useQuery('getUser', getUser);

const useGetQuestionnaires = (params: GetPaginetedRecordsParams): UseQueryResult<Bundle<FhirResource>> =>
    useQuery(['getQuestionnaires', params.page], async () => getQuestionnaires(params), { keepPreviousData: true });

const useGetQuestionnaire = (id: string): UseQueryResult<Questionnaire> =>
    useQuery(['getQuestionnaire', id], async () => getQuestionnaire(id), { keepPreviousData: true });

const useGetFormAssignments = (params: GetPaginetedRecordsParams): UseQueryResult<Bundle<FhirResource>> =>
    useQuery(['getFormAssignments', params.page], async () => getFormAssignments(params), { keepPreviousData: true });

export { useGetPatient, useGetUser, useGetQuestionnaires, useGetQuestionnaire, useGetFormAssignments };
