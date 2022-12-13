import { Typography, CircularProgress } from '@mui/material';
import type { FhirResource, Bundle, Task, Questionnaire } from 'fhir/r4';

import AssignedQuestionnaireItem from 'components/questionnaire_item/assigned_questionnaire_item';

type AssignedFormsPageProps = {
    data: Bundle<FhirResource> | undefined;
    isLoading: boolean;
};

const AssignedFormsPage = (props: AssignedFormsPageProps): JSX.Element => {
    const { data, isLoading } = props;

    const renderContent = (): JSX.Element => {
        if (isLoading) {
            return <CircularProgress sx={{ m: '2rem' }} />;
        }

        if (!data || !Array.isArray(data.entry) || data.entry.length === 0) {
            return (
                <Typography sx={{ ml: '.5rem' }} variant="h6">
                    Patient has no Questionnaires assigned
                </Typography>
            );
        }

        console.log(data);

        return (
            <>
                {data.entry.map((entry, index) => {
                    // assumptions: Patient should have only one Task with single Questionnaire
                    // we shouldn't create two different Tasks with the same Questionnaire for the same Patient
                    // in mentioned case there will be duplicate in the Assigned Questionnaries list
                    if (entry.resource?.resourceType === 'Task') {
                        const currentTask = entry.resource as Task;

                        let questionnaire;
                        if (data.entry) {
                            questionnaire = data.entry.find((item) => {
                                const questionnaireRef = currentTask?.focus?.reference;
                                return questionnaireRef ? item.fullUrl?.includes(questionnaireRef) : false;
                            })?.resource as Questionnaire;
                        }

                        if (questionnaire && questionnaire.id) {
                            return (
                                <AssignedQuestionnaireItem
                                    key={`${index + 1}-${questionnaire.id}`}
                                    questionnaire={questionnaire}
                                    authoredOn={currentTask?.authoredOn}
                                />
                            );
                        }
                    }
                    return null;
                })}
            </>
        );
    };

    return renderContent();
};

export default AssignedFormsPage;
