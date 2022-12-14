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

const getTasksQuery = (params: TaskParams, pagination: PaginationParams): QueryParams => ({
    queryKey: ['getTasks', pagination.page],
    queryFn: async () => getTasks(params, pagination),
    keepPreviousData: true
});

export { getUserQuery, getPatientQuery, getTasksQuery };
