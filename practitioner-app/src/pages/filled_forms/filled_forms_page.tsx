import { CircularProgress, Typography } from '@mui/material';
import type { Bundle, FhirResource, Task } from 'fhir/r4';

import { getIdFromReference } from '../../utils/reference';

import FilledFormItem from 'components/items/filled_form_item';

type FilledFormsPageProps = {
    data: Bundle<FhirResource> | undefined;
    isLoading: boolean;
};

const FilledFormsPage = (props: FilledFormsPageProps): JSX.Element => {
    const { data, isLoading } = props;

    if (isLoading) {
        return <CircularProgress sx={{ m: '2rem' }} />;
    }

    if (!data || !Array.isArray(data.entry) || data.entry.length === 0) {
        return (
            <Typography sx={{ ml: '.5rem' }} variant="h6">
                Patient has no forms filled by current user.
            </Typography>
        );
    }

    return (
        <>
            {data.entry.map((entry) => {
                const task = entry.resource as Task;
                return (
                    <FilledFormItem
                        key={task.id}
                        name={task.description ?? 'Form name not provided'}
                        date={task.lastModified}
                        responseId={getIdFromReference(task.focus)}
                    />
                );
            })}
        </>
    );
};

export default FilledFormsPage;
