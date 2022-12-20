import { LoadingButton } from '@mui/lab';
import { Box, Card, Checkbox, Typography } from '@mui/material';
import type { Questionnaire } from 'fhir/r4';
import { useContext, useEffect, useState } from 'react';

import { useAssignForms } from 'api/mutations';
import CustomSnackbar from 'components/custom_snackbar/custom_snackbar';
import { FormsContext } from 'hooks/useFormsData';

type QuestionnaireItemProps = {
    questionnaire: Questionnaire;
};

const QuestionnaireItem = (props: QuestionnaireItemProps): JSX.Element => {
    const { questionnaire } = props;
    const { formsToAssign, setFormsToAssign } = useContext(FormsContext);
    const { mutate: assign, error, isLoading, isSuccess } = useAssignForms();
    const [errorSnackbar, setErrorSnackbar] = useState(false);
    const [successSnackbar, setSuccessSnackbar] = useState(false);

    const isCheckedToAssign = (): boolean => formsToAssign.some((form) => form.id === questionnaire.id);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        if (!questionnaire.id) {
            return;
        }

        if (event.target.checked) {
            setFormsToAssign([
                ...formsToAssign,
                { id: questionnaire.id, name: questionnaire.title ?? 'Form name not provided' }
            ]);
        } else {
            setFormsToAssign(formsToAssign.filter((form) => form.id !== questionnaire.id));
        }
    };

    useEffect(() => {
        if (error) {
            setErrorSnackbar(true);
            console.error(error);
        }
    }, [error]);

    useEffect(() => {
        if (isSuccess) {
            setSuccessSnackbar(true);
        }
    }, [isSuccess]);

    const handleAssign = (): void =>
        assign([{ id: questionnaire.id as string, name: questionnaire.title ?? 'Form name not provided' }]);

    return (
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
            <CustomSnackbar
                key={`error${questionnaire.id}`}
                open={errorSnackbar}
                onClose={() => setErrorSnackbar(false)}
                message="Failed to assign form"
            />
            <CustomSnackbar
                key={`success${questionnaire.id}`}
                open={successSnackbar}
                severity="success"
                onClose={() => setSuccessSnackbar(false)}
                message="Form assigned successfully"
            />
            <Typography variant="h6" color="inherit">
                {questionnaire?.title || 'Form name not provided'}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Checkbox checked={isCheckedToAssign()} onChange={handleChange} />
                <LoadingButton loading={isLoading} variant="contained" onClick={handleAssign}>
                    Assign
                </LoadingButton>
            </Box>
        </Card>
    );
};

export default QuestionnaireItem;
