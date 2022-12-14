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

type TasksQuery = {
    queryKey: (string | number)[];
    queryFn: () => Promise<Bundle<FhirResource>>;
    keepPreviousData: boolean;
    onSuccess: (data: Bundle) => Bundle;
};

const getTasksQuery = (
    params: TaskParams,
    paginationOptions: {
        bundleId: string | undefined;
        page: number;
        itemsPerPage: number;
    },
    setBundleId: React.Dispatch<React.SetStateAction<string | undefined>>
): TasksQuery => ({
    queryKey: ['getTasks', paginationOptions.page],
    queryFn: async () =>
        getTasks(params, paginationOptions.bundleId, paginationOptions.page - 1, paginationOptions.itemsPerPage),
    onSuccess: (data: Bundle) => {
        setBundleId(data?.id);
        return data;
    },
    keepPreviousData: true
});

export { getUserQuery, getPatientQuery, getTasksQuery };
