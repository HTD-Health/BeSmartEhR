import type { Task, Patient, Practitioner } from 'fhir/r4';
import FHIR from 'fhirclient';
import Client from 'fhirclient/lib/Client';

// Tag used to identify Tasks that assign forms to patients
const taskQuestionnaireTag = 'be-smart-ehr-questionnaire';

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
const assignForm = async (formId: string, formName: string): Promise<Task> => {
    const c = await getClient();
    const userUrl = c.user.fhirUser;
    if (!userUrl) throw new Error('Missing current user data');
    const patientId = c.patient.id;
    if (!patientId) throw new Error('Missing selected patient data');

    const task: Task = {
        resourceType: 'Task',
        status: 'ready',
        intent: 'order',
        description: formName,
        for: { reference: `Patient/${patientId}` },
        owner: { reference: userUrl },
        focus: { reference: `Questionnaire/${formId}` },
        authoredOn: new Date().toISOString(),
        meta: { tag: [{ code: taskQuestionnaireTag }] }
    };

    const createdResource = await client.create(task as any);
    return createdResource as Task;
};

export { getPatient, getUser, assignForm };
