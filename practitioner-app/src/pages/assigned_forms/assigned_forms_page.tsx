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

        return (
            <>
                {data.entry &&
                    data.entry.map((taskItem) => {
                        if (taskItem.resource?.resourceType === 'Task') {
                            const currentTask = taskItem.resource as Task;

                            const taskRelatedQuestionnaireFromBundle = data.entry?.find((entry) => {
                                const questionnaireRef = currentTask.focus?.reference;

                                if (questionnaireRef) {
                                    return entry?.fullUrl?.includes(questionnaireRef);
                                }
                                return false;
                            });

                            if (taskRelatedQuestionnaireFromBundle) {
                                return (
                                    <AssignedQuestionnaireItem
                                        key={(taskRelatedQuestionnaireFromBundle.resource as Questionnaire).id}
                                        questionnaire={taskRelatedQuestionnaireFromBundle.resource as Questionnaire}
                                        authoredOn={currentTask.authoredOn}
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
