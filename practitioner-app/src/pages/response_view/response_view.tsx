import { CircularProgress, Container, Typography } from '@mui/material';
import Form from '@rjsf/mui';
import { RJSFSchema } from '@rjsf/utils';
import validator from '@rjsf/validator-ajv8';
import { responseToJSONSchema, toJSONSchema } from 'fhir-questionnaire-json-schema/src/schema';
import { Schema } from 'jsonschema';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useGetQuestionnaire, useGetResponse } from '../../api/queries';

import SmartAppBar from 'components/smart_app_bar/smart_app_bar';

const ResponseView = (): JSX.Element => {
    const { responseId } = useParams();

    const [rawSchema, setRawSchema] = useState<Schema>();
    const [generatedSchema, setGeneratedSchema] = useState();
    const [formData, setFormData] = useState();

    const { data: response, isLoading, error, isSuccess } = useGetResponse(responseId ?? '');

    const questionnaireId = response?.questionnaire?.split('/').pop();
    const {
        data: form,
        isLoading: formIsLoading,
        error: formError,
        isSuccess: formIsSuccess
    } = useGetQuestionnaire(questionnaireId);

    useEffect(() => {
        if (!response || !form || !isSuccess || !formIsSuccess) return;
        if (!response || !form) {
            setFormData(undefined);
            setRawSchema(undefined);
            return;
        }
        const [schema, uiSchema] = toJSONSchema(form as any);
        const responseData = responseToJSONSchema(response as any);

        console.log({ responseData });

        setRawSchema(schema);
        setGeneratedSchema(uiSchema);
        setFormData(responseData);
    }, [response, isSuccess, form, formIsSuccess]);

    // TODO: change to snackbars
    const renderContent = (): JSX.Element => {
        if (error || formError || ((!rawSchema || !formData) && !isLoading)) {
            return (
                <Typography sx={{ ml: '.5rem' }} variant="h6">
                    Could not load response
                </Typography>
            );
        }

        if (isLoading || formIsLoading) {
            return <CircularProgress sx={{ m: '2rem' }} />;
        }

        return (
            <>
                <Container maxWidth="md" sx={{ marginTop: '25px' }}>
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
                </Container>
            </>
        );
    };

    return (
        <>
            <SmartAppBar />
            {renderContent()}
        </>
    );
};

export default ResponseView;
