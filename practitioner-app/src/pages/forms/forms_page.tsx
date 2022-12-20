import { CircularProgress, Typography } from '@mui/material';
import type { Questionnaire } from 'fhir/r4';
import { useContext } from 'react';

import FormItem from 'components/items/form_item';
import { FormsContext } from 'hooks/useFormsData';

const FormsPage = (): JSX.Element => {
    const { data, isLoading } = useContext(FormsContext);

    const renderContent = (): JSX.Element => {
        if (isLoading) {
            return <CircularProgress sx={{ m: '2rem' }} />;
        }

        if (!data || !Array.isArray(data.entry) || data.entry.length === 0) {
            return (
                <Typography sx={{ ml: '.5rem' }} variant="h6">
                    No questionnaires found
                </Typography>
            );
        }

        return (
            <>
                {data?.entry?.map((entryItem) => (
                    <FormItem
                        key={(entryItem.resource as Questionnaire).id}
                        questionnaire={entryItem.resource as Questionnaire}
                    />
                ))}
            </>
        );
    };

    return renderContent();
};

export default FormsPage;
