import type { Bundle, Patient } from 'fhir/r4';
import FHIR from 'fhirclient';
import Client from 'fhirclient/lib/Client';

let client: Client;

const getClient = async (): Promise<Client> => {
    if (!client) {
        client = await FHIR.oauth2.ready();
    }
    return client;
};

const getPatient = async (): Promise<Patient> => {
    const c = await getClient();
    if (!c.patient?.id) throw new Error('Missing selected patient data');
    return c.request(`Patient/${c.patient.id}`);
};

const getUser = async (): Promise<Patient> => {
    const c = await getClient();
    const userUrl = c.user.fhirUser;
    if (!userUrl) throw new Error('Missing current user data');
    return c.request(userUrl);
};

export type TaskParams = {
    sort: string;
    status: 'ready' | 'completed';
};

export type PaginationParams = {
    bundleId: string | undefined;
    page: number;
    itemsPerPage: number;
};

const getTasks = async (params: TaskParams, pagination: PaginationParams): Promise<Bundle> => {
    const c = await getClient();

    const { bundleId, page, itemsPerPage } = pagination;

    if (!c.state.serverUrl) {
        throw new Error('Incorrect client state - missing "serverUrl"');
    }

    const allParams = [
        `status=${params.status}`,
        `_count=${itemsPerPage}`,
        `patient=${c.user.fhirUser}`,
        `intent=order`,
        `_sort=${params.sort}`,
        `_tag=be-smart-ehr-questionnaire`
    ];

    if (bundleId) {
        allParams.push(...[`_getpages=${bundleId}`, `_getpagesoffset=${(page - 1) * itemsPerPage}`]);

        const relationSearch = `${c.state.serverUrl}?`.concat(allParams.join('&'));
        return c.request(relationSearch);
    }

    return c.request(`Task?`.concat(allParams.join('&')));
};

export { getPatient, getUser, getTasks };
