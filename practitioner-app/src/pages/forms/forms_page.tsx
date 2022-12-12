import { Typography, CircularProgress } from '@mui/material';
import { useQuery } from 'react-query';
import type { Questionnaire } from 'fhir/r4';
import { useEffect, useContext } from 'react';

import QuestionnaireItem from 'components/questionnaire_item/questonnaire_item';
import { getQuestionnairesQuery } from 'api/queries';
import { FormsContext } from 'hooks/useFormsData';

const QUESTIONNAIRES_PER_PAGE = 5;

const FormsPage = (): JSX.Element => {
    const { page, bundleId, setBundleId, setErrorSnackbar, setResultsInTotal } = useContext(FormsContext);

    const { data, isLoading, error } = useQuery(
        getQuestionnairesQuery(
            {
                bundleId,
                page,
                questionnairesPerPage: QUESTIONNAIRES_PER_PAGE
            },
            setBundleId,
            setResultsInTotal
        )
    );

    useEffect(() => {
        if (error) {
            setErrorSnackbar(true);
            console.error(error);
        }
    }, [error]);

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
                    <QuestionnaireItem
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
