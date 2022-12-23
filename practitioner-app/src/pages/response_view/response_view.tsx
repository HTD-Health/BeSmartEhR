import { CircularProgress, Container } from '@mui/material';
import Form from '@rjsf/mui';
import { RJSFSchema } from '@rjsf/utils';
import validator from '@rjsf/validator-ajv8';
import { responseToJSONSchema, toJSONSchema } from 'fhir-questionnaire-json-schema/src/schema';
import { Schema } from 'jsonschema';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useGetQuestionnaire, useGetResponse } from '../../api/queries';
import CustomSnackbar from '../../components/custom_snackbar/custom_snackbar';

import SmartAppBar from 'components/smart_app_bar/smart_app_bar';

const ResponseView = (): JSX.Element => {
    const { responseId } = useParams();

    const [rawSchema, setRawSchema] = useState<Schema>();
    const [generatedSchema, setGeneratedSchema] = useState();
    const [formData, setFormData] = useState();
    const [errorSnackbar, setErrorSnackbar] = useState({ open: false, message: '' });

    const { data: response, isLoading, error, isSuccess } = useGetResponse(responseId ?? '');

    const questionnaireId = response?.questionnaire?.split('/').pop();
    const {
        data: form,
        isLoading: formIsLoading,
        error: formError,
        isSuccess: formIsSuccess
    } = useGetQuestionnaire(questionnaireId);

    useEffect(() => {
        if (!isSuccess || !formIsSuccess) return;
        if (!response || !form) {
            setFormData(undefined);
            setRawSchema(undefined);
            return;
        }
        const [schema, uiSchema] = toJSONSchema(form as any);
        const responseData = responseToJSONSchema(response as any);

        setRawSchema(schema);
        setGeneratedSchema(uiSchema);
        setFormData(responseData);
    }, [response, isSuccess, form, formIsSuccess]);

    useEffect(() => {
        if (error || formError) {
            setErrorSnackbar({ open: true, message: 'Could not load response' });
            console.error({ error, formError });
        }
    }, [error, formError]);

    const renderContent = (): JSX.Element => {
        if (isLoading || formIsLoading) {
            return <CircularProgress sx={{ m: '2rem' }} />;
        }

        return (
            <>
                <Container maxWidth="md" sx={{ marginTop: '25px' }}>
                    {rawSchema && (
                        <Form
                            validator={validator}
                            schema={rawSchema as RJSFSchema}
                            uiSchema={generatedSchema}
                            formData={formData}
                            readonly
                        >
                            {/* To hide the submit button */}
                            <></>
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

export default ResponseView;
