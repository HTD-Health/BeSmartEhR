import type { Patient, Practitioner, Bundle, BundleEntry, FhirResource } from 'fhir/r4';
import FHIR from 'fhirclient';
import Client from 'fhirclient/lib/Client';

import { createAssignmentTask, FormMeta } from './models';

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

export { getPatient, getUser, assignForms };
