import type { Task } from 'fhir/r4';

// Tag used to identify Tasks that assign forms to patients
const taskQuestionnaireTag = 'be-smart-ehr-questionnaire';

type FormMeta = {
    id: string;
    name: string;
};

const createAssignmentTask = (formMeta: FormMeta, patientId: string, userUrl: string): Task => ({
    resourceType: 'Task',
    status: 'ready',
    intent: 'order',
    description: formMeta.name,
    for: { reference: `Patient/${patientId}` },
    owner: { reference: userUrl },
    focus: { reference: `Questionnaire/${formMeta.id}` },
    authoredOn: new Date().toISOString(),
    meta: { tag: [{ code: taskQuestionnaireTag }] }
});

export { createAssignmentTask, FormMeta };
