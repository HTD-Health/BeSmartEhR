import type { Bundle, FhirResource } from 'fhir/r4';

import { getPatient, getTasks, getUser, TaskParams } from './api';

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

const getTasksQuery = (
    params: TaskParams,
    paginationOptions: {
        bundleId: string | undefined;
        page: number;
        itemsPerPage: number;
    }
): QueryParams => ({
    queryKey: ['getTasks', paginationOptions.page],
    queryFn: async () =>
        getTasks(params, paginationOptions.bundleId, paginationOptions.page - 1, paginationOptions.itemsPerPage),
    keepPreviousData: true
});

export { getUserQuery, getPatientQuery, getTasksQuery };
