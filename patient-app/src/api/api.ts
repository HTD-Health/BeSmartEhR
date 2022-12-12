import type { Bundle, FhirResource, Patient } from 'fhir/r4';
import FHIR from 'fhirclient';
import Client from 'fhirclient/lib/Client';

import assignedForms from '../pages/forms_list/forms_assigned.json';
import filledForms from '../pages/forms_list/forms_filled.json';

let client: Client;

const getClient = async (): Promise<Client> => {
    if (!client) {
        client = await FHIR.oauth2.ready();
    }
    return client;
};

const getPatient = async (): Promise<Patient> => {
    const c = await getClient();
    if (!c.patient?.id) throw new Error('No patient selected');
    return c.request(`Patient/${c.patient.id}`);
};

const getUser = async (): Promise<Patient> => {
    const c = await getClient();
    const userUrl = c.user.fhirUser;
    if (!userUrl) throw new Error('Missing current user data');
    return c.request(userUrl);
};

const getTasks = async (
    status: 'ready' | 'completed',
    bundleId: string | undefined,
    page: number,
    itemsPerPage: number
): Promise<Bundle> => {
    const c = await getClient();

    if (!c.state.serverUrl) {
        throw new Error('Incorrect client state - missing "serverUrl"');
    }

    if (bundleId) {
        const params = [
            `status=${status}`,
            `_getpages=${bundleId}`,
            `_getpagesoffset=${page * itemsPerPage}`,
            `_count=${itemsPerPage}`,
            '_bundletype=searchset'
        ];

        const relationSearch = `${c.state.serverUrl}?`.concat(params.join('&'));
        return c.request(relationSearch);
    }

    if (status === 'ready') {
        const bundle = assignedForms as Bundle<FhirResource>;
        return bundle;
    }
    const bundle = filledForms as Bundle<FhirResource>;
    return bundle;

    // return c.request(`Task?status=${status}&_count=${itemsPerPage}`);
    // return c.request(`Task?_count=${itemsPerPage}`);
};

export { getPatient, getUser, getTasks };
