import { CircularProgress, Typography } from '@mui/material';
import type { Bundle, FhirResource, Task } from 'fhir/r4';

import { getIdFromReference } from '../../utils/reference';

import AssignedQuestionnaireItem from 'components/questionnaire_item/assigned_questionnaire_item';

type AssignedFormsPageProps = {
    data: Bundle<FhirResource> | undefined;
    isLoading: boolean;
};

const AssignedFormsPage = (props: AssignedFormsPageProps): JSX.Element => {
    const { data, isLoading } = props;

    if (isLoading) {
        return <CircularProgress sx={{ m: '2rem' }} />;
    }

    if (!data || !Array.isArray(data.entry) || data.entry.length === 0) {
        return (
            <Typography sx={{ ml: '.5rem' }} variant="h6">
                Patient has no forms assigned by current user.
            </Typography>
        );
    }

    return (
        <>
            {data.entry.map((entry) => {
                const task = entry.resource as Task;
                return (
                    <AssignedQuestionnaireItem
                        key={task.id}
                        name={task.description || 'Form name not provided'}
                        questionnaireId={getIdFromReference(task.reasonReference)}
                        authoredOn={task?.authoredOn}
                    />
                );
            })}
        </>
    );
};

export default AssignedFormsPage;
