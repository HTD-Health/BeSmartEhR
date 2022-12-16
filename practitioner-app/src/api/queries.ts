import type { Bundle, FhirResource, Patient, Practitioner } from 'fhir/r4';
import { useQuery, UseQueryResult } from 'react-query';

import { getPatient, getUser, getQuestionnaires, getQuestionnairesAssignedToPatient } from './api';
import { GetQuestionnairesParams } from './models';

const useGetPatient = (): UseQueryResult<Patient> => useQuery('getPatient', getPatient);

const useGetUser = (): UseQueryResult<Practitioner> => useQuery('getUser', getUser);

const useGetQuestionnaires = (params: GetQuestionnairesParams): UseQueryResult<Bundle<FhirResource>> =>
    useQuery(['getQuestionnaires', params.page], async () => getQuestionnaires(params), { keepPreviousData: true });

export { useGetPatient, useGetUser, useGetQuestionnaires };
