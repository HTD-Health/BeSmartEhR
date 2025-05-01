import DoneAllIcon from '@mui/icons-material/DoneAll';
import { Box, Button, CircularProgress, Container, Typography } from '@mui/material';
import { IChangeEvent } from '@rjsf/core';
import Form from '@rjsf/mui';
import { RJSFSchema } from '@rjsf/utils';
import validator from '@rjsf/validator-ajv8';
import { toJSONSchema, toQuestionnaireResponse } from 'fhir-questionnaire-json-schema';
import { Schema } from 'jsonschema';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { useFinishTask, useSubmitResponse } from '../../api/mutations';
import { useGetQuestionnaire } from '../../api/queries';

import CustomSnackbar from 'components/custom_snackbar/custom_snackbar';
import SmartAppBar from 'components/smart_app_bar/smart_app_bar';

const FormFill = (): JSX.Element => {
    const {
        data: responseRef,
        mutate: submitResponse,
        isSuccess: submitSuccess,
        error: submitError,
        isLoading: submitIsLoading
    } = useSubmitResponse();

    const {
        mutate: finishTask,
        isSuccess: finishTaskSuccess,
        error: finishTaskError,
        isLoading: finishTaskIsLoading
    } = useFinishTask();

    const { id } = useParams();
    const {
        state: { taskId }
    } = useLocation();
    const navigate = useNavigate();

    const [errorSnackbar, setErrorSnackbar] = useState({ open: false, message: '' });

    const [rawSchema, setRawSchema] = useState<Schema>();
    const [generatedSchema, setGeneratedSchema] = useState();
    const [formData, setFormData] = useState();

    const { data, isLoading, error, isSuccess } = useGetQuestionnaire(id ?? '');

    const handleSubmit = (resData: IChangeEvent): void => {
        if (!data) return;
        const response = toQuestionnaireResponse(data, resData.formData);
        submitResponse({ response, questionnaireId: id });
    };

    useEffect(() => {
        if (!data || !isSuccess) return;
        const [schema, uiSchema] = toJSONSchema(data);

        setRawSchema(schema);
        setGeneratedSchema(uiSchema);
    }, [data, isSuccess]);

    useEffect(() => {
        if (taskId && responseRef) finishTask({ taskId, responseRef });
    }, [finishTask, responseRef, submitSuccess, taskId]);

    useEffect(() => {
        if (error) {
            setErrorSnackbar({ open: true, message: 'Could not load questionnaire' });
            console.error(error);
        }
    }, [error]);

    useEffect(() => {
        if (submitError || finishTaskError) {
            setErrorSnackbar({ open: true, message: 'Could not submit the response' });
            console.error({ submitError, finishTaskError });
        }
    }, [submitError, finishTaskError]);

    const renderContent = (): JSX.Element => {
        if (isLoading || submitIsLoading || finishTaskIsLoading) {
            return <CircularProgress sx={{ m: '2rem' }} />;
        }

        if (submitSuccess && finishTaskSuccess) {
            return (
                <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="70vh">
                    <DoneAllIcon fontSize="large" />
                    <Typography sx={{ ml: '1.5rem' }} variant="h6">
                        Response submitted
                    </Typography>
                </Box>
            );
        }

        return (
            <>
                <Container maxWidth="md" sx={{ marginTop: '25px' }}>
                    {rawSchema && (
                        <Form
                            validator={validator}
                            schema={rawSchema as RJSFSchema}
                            uiSchema={generatedSchema}
                            onSubmit={handleSubmit}
                            formData={formData}
                            onChange={(form: IChangeEvent) => setFormData(form.formData)}
                        >
                            <Box display="flex" gap="1rem" justifyContent="center">
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={() => {
                                        if (window.confirm('If you cancel, your progress will not be saved.'))
                                            navigate(-1);
                                    }}
                                    sx={{ my: '0.5rem' }}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" variant="contained" sx={{ my: '0.5rem' }}>
                                    Submit
                                </Button>
                            </Box>
                        </Form>
                    )}
                </Container>
            </>
        );
    };

    return (
        <>
            <SmartAppBar />
            <CustomSnackbar
                open={errorSnackbar.open}
                onClose={() => setErrorSnackbar({ open: false, message: '' })}
                message={errorSnackbar.message}
            />
            {renderContent()}
        </>
    );
};

export default FormFill;
