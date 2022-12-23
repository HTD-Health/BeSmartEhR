import type { Bundle, Patient, QuestionnaireResponse } from 'fhir/r4';
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
    status: 'ready' | 'completed';
    sort?: string;
};

export type PaginationParams = {
    bundleId: string;
    page: number;
};

const getTasks = async (params: TaskParams, count: number, pagination?: PaginationParams): Promise<Bundle> => {
    const c = await getClient();

    if (!c.state.serverUrl) {
        throw new Error('Incorrect client state - missing "serverUrl"');
    }

    const allParams = [
        `status=${params.status}`,
        `_count=${count}`,
        `patient=${c.user.fhirUser}`,
        `intent=order`,
        `_sort=${params.sort ?? ''}`,
        `_tag=be-smart-ehr-questionnaire`
    ];

    if (pagination?.bundleId) {
        allParams.push(...[`_getpages=${pagination.bundleId}`, `_getpagesoffset=${(pagination.page - 1) * count}`]);

        const relationSearch = `${c.state.serverUrl}?`.concat(allParams.join('&'));
        return c.request(relationSearch);
    }

    return c.request({
        url: `Task?`.concat(allParams.join('&')),
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            Accept: 'application/json',
            'Cache-Control': 'no-cache'
        }
    });
};

const getQuestionnaire = async (id?: string): Promise<Bundle> => {
    const c = await getClient();

    if (!c.state.serverUrl) {
        throw new Error('Incorrect client state - missing "serverUrl"');
    }

    return c.request(`Questionnaire/${id}`);
};

const getResponse = async (responseId: string): Promise<QuestionnaireResponse> => {
    const c = await getClient();

    if (!c.state.serverUrl) {
        throw new Error('Incorrect client state - missing "serverUrl"');
    }

    return c.request(`QuestionnaireResponse/${responseId}`);
};

export { getPatient, getUser, getTasks, getQuestionnaire, getResponse };
