import type { Communication, Patient, Practitioner } from 'fhir/r4';
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
    if (!c.patient) throw new Error('Missing selected patient data');
    return c.request(`Patient/${c.patient.id}`);
};

const getUser = async (): Promise<Practitioner> => {
    const c = await getClient();
    const userUrl = c.user.fhirUser;
    if (!userUrl) throw new Error('Missing current user data');
    return c.request(userUrl);
};

// Assigning a new form to a patient is based on the Communication FHIR resource
// https://www.hl7.org/fhir/communication.html
// Communication connects a patient to a practitioner and a form
const assignForm = async (formId: string, formName: string): Promise<Communication> => {
    const c = await getClient();
    const userUrl = c.user.fhirUser;
    if (!userUrl) throw new Error('Missing current user data');
    const patientId = c.patient.id;
    if (!patientId) throw new Error('Missing selected patient data');

    const communication: Communication = {
        resourceType: 'Communication',
        status: 'in-progress',
        subject: { reference: `Patient/${patientId}` },
        sender: { reference: userUrl },
        instantiatesCanonical: [`Questionnaire/${formId}`],
        note: [{ text: formName }],
        sent: new Date().toISOString()
    };

    const createdResource = await client.create(communication as any);

    return createdResource as Communication;
};

export { getPatient, getUser, assignForm };
