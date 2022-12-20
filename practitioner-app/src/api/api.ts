import type { Bundle, BundleEntry, FhirResource, Patient, Practitioner } from 'fhir/r4';
import FHIR from 'fhirclient';
import Client from 'fhirclient/lib/Client';

import { createAssignmentTask, FormMeta, GetPaginetedRecordsParams, TASK_QUESTIONNAIRE_TAG } from './models';

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

const getQuestionnaires = async (params: GetPaginetedRecordsParams): Promise<Bundle> => {
    const c = await getClient();

    const { bundleId, page, recordsPerPage } = params;
    const realPage = page - 1;

    if (!c.state.serverUrl) {
        throw new Error('Incorrect client state - missing "serverUrl"');
    }

    if (bundleId) {
        return performPaginateSearch(bundleId, realPage * recordsPerPage, recordsPerPage);
    }

    // the initial call
    return c.request(`Questionnaire?_count=${recordsPerPage}`);
};

const getFormAssignments = async (params: GetPaginetedRecordsParams): Promise<Bundle> => {
    const c = await getClient();

    const { bundleId, page, recordsPerPage } = params;
    const realPage = page - 1;

    if (!c.state.serverUrl) {
        throw new Error('Incorrect client state - missing "serverUrl"');
    }

    if (bundleId) {
        return performPaginateSearch(bundleId, realPage * recordsPerPage, recordsPerPage);
    }

    // the initial call
    const p = [
        `owner=${c.user.fhirUser}`,
        `patient=Patient/${c.patient.id}`,
        `_count=${recordsPerPage}`,
        `_tag=${TASK_QUESTIONNAIRE_TAG}`,
        `_sort=-authored-on`
    ];
    return c.request({
        url: `Task?`.concat(p.join('&')),
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            Accept: 'application/json',
            'Cache-Control': 'no-cache'
        }
    });
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
    return c.request({
        url: relationSearch,
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            Accept: 'application/json',
            'Cache-Control': 'no-cache'
        }
    });
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

export { getPatient, getUser, getQuestionnaires, assignForms, getFormAssignments };
