import type { QuestionnaireResponse, Task } from 'fhir/r4';

// Tag used to identify Tasks that assign forms to patients
const TASK_QUESTIONNAIRE_TAG = 'be-smart-ehr-questionnaire';

type GetPaginetedRecordsParams = {
    bundleId: string | undefined;
    page: number;
    recordsPerPage: number;
};

type FormMeta = {
    id: string;
    name: string;
};

type SubmitResponseParams = {
    qr: QuestionnaireResponse;
    questionnaireId?: string;
};

type FinishTaskParams = {
    taskId: string;
    responseRef: string;
};

const createAssignmentTask = (formMeta: FormMeta, patientId: string, userUrl: string): Task => ({
    resourceType: 'Task',
    status: 'ready',
    intent: 'order',
    description: formMeta.name,
    for: { reference: `Patient/${patientId}` },
    owner: { reference: userUrl },
    reasonReference: { reference: `Questionnaire/${formMeta.id}` },
    authoredOn: new Date().toISOString(),
    meta: { tag: [{ code: TASK_QUESTIONNAIRE_TAG }] }
});

export {
    createAssignmentTask,
    FormMeta,
    SubmitResponseParams,
    FinishTaskParams,
    GetPaginetedRecordsParams,
    TASK_QUESTIONNAIRE_TAG
};
