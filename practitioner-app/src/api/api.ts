import FHIR from 'fhirclient';
import Client from 'fhirclient/lib/Client';

let client: Client;

const getClient = async () => {
    if (!client) {
        client = await FHIR.oauth2.ready();
    }
    return client;
};

const getPatient = async () => {
    const c = await getClient();
    // if (!c.patient) throw new Error('No patient selected');
    // return await c.request(`Patient/${c.patient.id}`);
    return await c.request(`Patient/c20ccf5d-19ac-4dfe-bdc3-3d1d6344facc`);
};

const getUser = async () => {
    const c = await getClient();
    const userUrl = c.user.fhirUser;
    if (!userUrl) throw new Error('No user selected');
    return await c.request(userUrl);
};

export { getPatient, getUser };
