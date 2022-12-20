import type { Bundle, BundleEntry, FhirResource, Patient, Practitioner } from 'fhir/r4';
import FHIR from 'fhirclient';
import Client from 'fhirclient/lib/Client';

import { createAssignmentTask, FormMeta, GetQuestionnairesParams } from './models';

let client: Client;

const getClient = async (): Promise<Client> => {
    if (!client) {
        client = await FHIR.oauth2.ready();
    }
    return client;
};

const getPatient = async (): Promise<Patient> => {
    const c = await getClient();
    if (!c.patient) throw new Error('Missing selected patient data');
    return c.request(`Patient/${c.patient.id}`);
};

const getUser = async (): Promise<Practitioner> => {
    const c = await getClient();
    const userUrl = c.user.fhirUser;
    if (!userUrl) throw new Error('Missing current user data');
    return c.request(userUrl);
};

const getQuestionnaires = async (params: GetQuestionnairesParams): Promise<Bundle> => {
    const c = await getClient();

    const { bundleId, page, questionnairesPerPage } = params;
    const realPage = page - 1;

    if (!c.state.serverUrl) {
        throw new Error('Incorrect client state - missing "serverUrl"');
    }

    if (bundleId) {
        const p = [
            `_getpages=${bundleId}`,
            `_getpagesoffset=${realPage * questionnairesPerPage}`,
            `_count=${questionnairesPerPage}`,
            '_bundletype=searchset'
        ];

        const relationSearch = `${c.state.serverUrl}?`.concat(p.join('&'));
        return c.request(relationSearch);
    }

    return c.request(`Questionnaire?_count=${questionnairesPerPage}`);
};

const getQuestionnaire = async (id: string): Promise<Bundle> => {
    const c = await getClient();

    if (!c.state.serverUrl) {
        throw new Error('Incorrect client state - missing "serverUrl"');
    }

    return c.request(`Questionnaire/${id}`);
};

// Assigning a new form to a patient is based on the Task FHIR resource
// https://www.hl7.org/fhir/task.html
// Task connects a patient to a practitioner and a form
const assignForms = async (formDataList: FormMeta[]): Promise<string[]> => {
    if (!formDataList.length) return [];
    if (formDataList.length === 1) return [await assignSingleForm(formDataList[0])];
    return assignBundleForms(formDataList);
};

const assignSingleForm = async (formData: FormMeta): Promise<string> => {
    const c = await getClient();
    const userUrl = c.user.fhirUser;
    if (!userUrl) throw new Error('Missing current user data');
    const patientId = c.patient.id;
    if (!patientId) throw new Error('Missing selected patient data');

    const task = createAssignmentTask(formData, patientId, userUrl);

    const createdResource = await client.create(task as any);
    return `${createdResource.resourceType}/${createdResource.id}`;
};

const assignBundleForms = async (formDataList: FormMeta[]): Promise<string[]> => {
    const c = await getClient();
    const userUrl = c.user.fhirUser;
    if (!userUrl) throw new Error('Missing current user data');
    const patientId = c.patient.id;
    if (!patientId) throw new Error('Missing selected patient data');

    const tasks = formDataList.map((formData) => createAssignmentTask(formData, patientId, userUrl));
    const tasksBundleEntries: BundleEntry<FhirResource>[] = tasks.map((task) => ({
        request: { method: 'POST', url: 'Task' },
        resource: task
    }));
    const bundle: Bundle = { resourceType: 'Bundle', type: 'transaction', entry: tasksBundleEntries };

    const requestOptions = {
        url: ``,
        method: 'POST',
        body: JSON.stringify(bundle),
        headers: { 'content-type': 'application/json' }
    };
    const createdBundle = await client.request(requestOptions);
    return createdBundle.entry.map((entry: BundleEntry<FhirResource>) => entry.response?.location);
};

export { getPatient, getUser, getQuestionnaires, assignForms, getQuestionnaire };
