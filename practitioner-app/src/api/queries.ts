import type { Bundle, FhirResource, Patient, Practitioner } from 'fhir/r4';
// eslint-disable-next-line import/no-unresolved
import { Questionnaire } from 'fhir/r4';
import { useQuery, UseQueryResult } from 'react-query';

import { getPatient, getQuestionnaire, getQuestionnaires, getUser } from './api';
import { GetQuestionnairesParams } from './models';

const useGetPatient = (): UseQueryResult<Patient> => useQuery('getPatient', getPatient);

const useGetUser = (): UseQueryResult<Practitioner> => useQuery('getUser', getUser);

const useGetQuestionnaires = (params: GetQuestionnairesParams): UseQueryResult<Bundle<FhirResource>> =>
    useQuery(['getQuestionnaires', params.page], async () => getQuestionnaires(params), { keepPreviousData: true });

const useGetQuestionnaire = (id: string): UseQueryResult<Questionnaire> =>
    useQuery(['getQuestionnaire', id], async () => getQuestionnaire(id), { keepPreviousData: true });

export { useGetPatient, useGetUser, useGetQuestionnaires, useGetQuestionnaire };
