import type { Bundle, FhirResource } from 'fhir/r4';

import { getPatient, getTasks, getUser } from './api';

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
    options: {
        bundleId: string | undefined;
        page: number;
        itemsPerPage: number;
        status: 'ready' | 'completed';
    },
    setBundleId: React.Dispatch<React.SetStateAction<string | undefined>>
): TasksQuery => ({
    queryKey: ['getTasks', options.page],
    queryFn: async () => getTasks(options.status, options.bundleId, options.page - 1, options.itemsPerPage),
    onSuccess: (data: Bundle) => {
        setBundleId(data?.id);
        return data;
    },
    keepPreviousData: true
});

export { getUserQuery, getPatientQuery, getTasksQuery };
