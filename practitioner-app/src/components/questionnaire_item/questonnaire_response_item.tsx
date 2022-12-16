import { Box, Card, CircularProgress, Typography } from '@mui/material';
import type { QuestionnaireResponse } from 'fhir/r4';
import { useEffect, useState } from 'react';

import { useGetQuestionnaire } from 'api/queries';
import CustomSnackbar from 'components/custom_snackbar/custom_snackbar';

type QuestionnaireResponseItemProps = {
    questionnaireResponse: QuestionnaireResponse;
};

const QuestionnaireResponseItem = (props: QuestionnaireResponseItemProps): JSX.Element => {
    const [errorSnackbar, setErrorSnackbar] = useState<boolean>(false);
    const { questionnaireResponse } = props;

    const dateString = questionnaireResponse?.authored
        ? new Date(questionnaireResponse.authored as string).toDateString()
        : 'Response date not specified';

    const {
        data,
        isLoading: isQueryLoading,
        error: queryError
    } = useGetQuestionnaire({
        id: questionnaireResponse?.questionnaire || ''
    });

    useEffect(() => {
        if (queryError) {
            setErrorSnackbar(true);
            console.error(queryError);
        }
    }, [queryError]);

    if (isQueryLoading) {
        return <CircularProgress />;
    }
    return (
        <>
            <CustomSnackbar
                key="error"
                open={errorSnackbar}
                onClose={() => setErrorSnackbar(false)}
                message={queryError ? 'Failed to get patient data' : 'Failed to assign forms'}
            />
            <Card
                sx={{
                    m: '.5rem',
                    p: '1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    border: 0.5,
                    borderColor: 'grey.500'
                }}
            >
                <Box>
                    <Typography variant="h6" color="inherit">
                        Questionnaire name: {data?.title}
                    </Typography>
                    <Typography variant="h6" color="inherit">
                        Questionnaire ID: {questionnaireResponse.questionnaire}
                    </Typography>
                    <Typography variant="h6" color="inherit">
                        Status: {questionnaireResponse.status}
                    </Typography>
                    <Typography variant="h6" color="inherit">
                        Assignment date: {dateString}
                    </Typography>
                </Box>
            </Card>
        </>
    );
};
export default QuestionnaireResponseItem;
