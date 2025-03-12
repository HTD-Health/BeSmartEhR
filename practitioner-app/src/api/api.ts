import type { Bundle, BundleEntry, FhirResource, Patient, Practitioner, QuestionnaireResponse } from 'fhir/r4';
import FHIR from 'fhirclient';
import Client from 'fhirclient/lib/Client';

import {
    createAssignmentTask,
    FinishTaskParams,
    FormMeta,
    GetPaginatedRecordsParams,
    SubmitResponseParams,
    TASK_QUESTIONNAIRE_TAG
} from './models';

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

const getQuestionnaires = async (params: GetPaginatedRecordsParams): Promise<Bundle> => {
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
    return c.request({
        url: `Questionnaire?_count=${recordsPerPage}`,
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            Accept: 'application/json'
        }
    });
};

const submitResponse = async ({ response, questionnaireId }: SubmitResponseParams): Promise<string> => {
    const c = await getClient();
    const userUrl = c.user.fhirUser;
    if (!userUrl) throw new Error('Missing current user data');
    const patientId = c.patient.id;
    if (!patientId) throw new Error('Missing selected patient data');
    if (!c.state.serverUrl) {
        throw new Error('Incorrect client state - missing "serverUrl"');
    }
    const questionnaireUri = questionnaireId ? `${c.state.serverUrl}/Questionnaire/${questionnaireId}` : undefined;
    const enrichedQr: QuestionnaireResponse = {
        ...response,
        author: { reference: userUrl },
        subject: { reference: `Patient/${c.patient.id}` },
        source: { reference: `Patient/${c.patient.id}` },
        questionnaire: questionnaireUri
    };

    const createdResource = await c.create(enrichedQr as any);
    return `${createdResource.resourceType}/${createdResource.id}`;
};

const finishTask = async ({ taskId, responseRef }: FinishTaskParams): Promise<string> => {
    const c = await getClient();
    const createdResource = await c.patch(`Task/${taskId}`, [
        { op: 'replace', path: '/status', value: 'completed' },
        { op: 'add', path: '/focus', value: { reference: responseRef } },
        { op: 'add', path: '/lastModified', value: new Date().toISOString() }
    ]);
    return `${createdResource.resourceType}/${createdResource.id}`;
};

const getQuestionnaireTasks = async (params: GetPaginatedRecordsParams, completed: boolean): Promise<Bundle> => {
    const c = await getClient();

    const { bundleId, page, recordsPerPage } = params;
    const realPage = page - 1;

    // const status = completed ? 'completed' : 'ready';
    const sort = completed ? '-modified' : '-authored-on';

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
        `intent=order`,
        `_tag=${TASK_QUESTIONNAIRE_TAG}`,
        // `status=${status}`,
        `_sort=${sort}`
    ];
    return c.request({
        url: `Task?`.concat(p.join('&')),
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            Accept: 'application/json',
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
            Accept: 'application/json'
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

    const createdResource = await c.create(task as any);
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
    const createdBundle = await c.request(requestOptions);
    return createdBundle.entry.map((entry: BundleEntry<FhirResource>) => entry.response?.location);
};

// TODO: Figure out why this shows no results
// const getGoals = async (): Promise<any> => {
//     const c = await getClient();
    
//     try {
//         const response = await c.request({
//             url: `Goal?patient=${c.patient.id}`,
//             method: 'GET'
//         });
//         return response;
//     } catch (e) {
//         console.error(`Error Retrieving Goals: ${e}`);
//         throw e;
//     }
// }

const getGoal = async (goalId: string): Promise<any> => {
    const c = await getClient();
    const url = c.state.serverUrl.replace('R4', 'STU3');

    try {
        const response = await c.request({
            url: `${url}/Goal/${goalId}`,
            method: 'GET',
            headers: {
                Accept: 'application/json'
            }
        });
        console.log(`Get Goal: ${JSON.stringify(response)}`);
        return response;
    } catch (e) {
        console.error(`Error Retrieving Goal: ${e}`);
        throw e;
    }
}

const getGoalIds = async (): Promise<string[]> => {
    const c = await getClient();
    let goalIds = [];
    try {
        goalIds = JSON.parse(localStorage.getItem(`goalIds-${c.patient.id}`) || '[]');
    } catch (e) {
        console.error(`Error Parsing Goal IDs: ${e}`);
    }
    return goalIds;
}

const addGoalId = async (goalId: string): Promise<void> => {
    const c = await getClient();
    const goalIds = await getGoalIds();
    goalIds.push(goalId);
    localStorage.setItem(`goalIds-${c.patient.id}`, JSON.stringify(goalIds));
}

const getGoals = async (): Promise<any> => {
    const goalIds = await getGoalIds();
    const results = await Promise.all(goalIds.map(async (goalId) => getGoal(goalId)))

    return results;
}


const addGoal = async (description: string): Promise<any> => {
    const c = await getClient();
    const url = c.state.serverUrl.replace('R4', 'STU3');

    const goal = {
        resourceType: "Goal",
        description: {
            text: description
        },
        note: [
            {
                text: description
            }
        ],
        expressedBy: {
            reference: `Practitioner/${c.user.fhirUser}`
        },
        subject: {
            reference: `Patient/${c.patient.id}`
        }
    };

    try {
        const result = await c.request({
            url: `${url}/Goal`,
            method: 'POST',
            body: JSON.stringify(goal),
            headers: {
                'content-type': 'application/json',
                Accept: 'application/json',
                Prefer: 'return=representation'
            }
        })

        // Example showing goal retrieval after creation
        if (result.id) {
            getGoal(result.id);
            addGoalId(result.id);
        }
        return result;
    } catch (e) {
        console.error(`Error Creating Goal: ${e}`);
        throw e;
    }
}

export {
    getPatient,
    getUser,
    getQuestionnaires,
    assignForms,
    getQuestionnaire,
    getQuestionnaireTasks,
    getResponse,
    submitResponse,
    finishTask,
    getGoals,
    addGoal,
    getGoal
};
