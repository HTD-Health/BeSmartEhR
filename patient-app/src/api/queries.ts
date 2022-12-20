import type { Bundle, FhirResource } from 'fhir/r4';

import { getPatient, getTasks, getUser, PaginationParams, TaskParams } from './api';

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

export { getUserQuery, getPatientQuery, getTasksQuery };
