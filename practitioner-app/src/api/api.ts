import type { Bundle, Patient, Practitioner } from 'fhir/r4';
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
    if (!c.patient) throw new Error('No patient selected');
    return c.request(`Patient/${c.patient.id}`);
};

const getUser = async (): Promise<Practitioner> => {
    const c = await getClient();
    const userUrl = c.user.fhirUser;
    if (!userUrl) throw new Error('Missing current user data');
    return c.request(userUrl);
};

const getQuestionnaires = async (
    bundleId: string | undefined,
    page: number,
    questionnairesPerPage: number
): Promise<Bundle> => {
    const c = await getClient();

    if (!c.state.serverUrl) {
        throw new Error('Incorrect client state - missing "serverUrl"');
    }

    if (bundleId) {
        return performPaginateSearch(bundleId, page * questionnairesPerPage, questionnairesPerPage);
    }

    // the initial call
    return c.request(`Questionnaire?_count=${questionnairesPerPage}`);
};

const getQuestionnairesAssignedToPatient = async (
    bundleId: string | undefined,
    page: number,
    tasksPerPage: number
): Promise<Bundle> => {
    const c = await getClient();

    if (!c.state.serverUrl) {
        throw new Error('Incorrect client state - missing "serverUrl"');
    }

    if (bundleId) {
        return performPaginateSearch(bundleId, page * tasksPerPage, tasksPerPage);
    }

    // the initial call
    const params = [
        `owner=${c.user.fhirUser}`,
        `patient=${c.patient.id}`,
        `_count=${tasksPerPage}`,
        `_tag=be-smart-ehr-questionnaire`,
        `_include=Task:focus`
    ];
    return c.request(`Task?`.concat(params.join('&')));
};

const performPaginateSearch = async (bundleId: string, pagesOffset: number, count: number): Promise<Bundle> => {
    const c = await getClient();

    const params = [
        `_getpages=${bundleId}`,
        `_getpagesoffset=${pagesOffset}`,
        `_count=${count}`,
        '_bundletype=searchset'
    ];

    const relationSearch = `${c.state.serverUrl}?`.concat(params.join('&'));
    return c.request(relationSearch);
};

export { getPatient, getUser, getQuestionnaires, getQuestionnairesAssignedToPatient };
