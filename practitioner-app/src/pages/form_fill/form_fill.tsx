import { CircularProgress, Container, Typography } from '@mui/material';
import { IChangeEvent } from '@rjsf/core';
import Form from '@rjsf/mui';
import { RJSFSchema } from '@rjsf/utils';
import validator from '@rjsf/validator-ajv8';
import { toQuestionnaireResponse } from 'fhir-questionnaire-json-schema/src/response';
import { toJSONSchema } from 'fhir-questionnaire-json-schema/src/schema';
import { Schema } from 'jsonschema';
import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import { useFinishTask, useSubmitResponse } from '../../api/mutations';
import { useGetQuestionnaire } from '../../api/queries';

import SmartAppBar from 'components/smart_app_bar/smart_app_bar';

const FormFill = (): JSX.Element => {
    const {
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

    const [rawSchema, setRawSchema] = useState<Schema>();
    const [generatedSchema, setGeneratedSchema] = useState();
    const [formData, setFormData] = useState();

    const { data, isLoading, error, isSuccess } = useGetQuestionnaire(id ?? '');

    const handleSubmit = (resData: IChangeEvent): void => {
        if (!data) return;
        const qr = toQuestionnaireResponse(data, resData.formData);
        submitResponse({ qr, questionnaireId: id });
        if (taskId) finishTask(taskId);
    };

    useEffect(() => {
        if (!data || !isSuccess) return;
        const [schema, uiSchema] = toJSONSchema(data);

        setRawSchema(schema);
        setGeneratedSchema(uiSchema);
    }, [data, isSuccess]);

    const renderContent = (): JSX.Element => {
        if (submitError || finishTaskError) {
            return (
                <Typography sx={{ ml: '.5rem' }} variant="h6">
                    Could not submit the response
                </Typography>
            );
        }

        if (error || (!rawSchema && !isLoading)) {
            return (
                <Typography sx={{ ml: '.5rem' }} variant="h6">
                    Could not load questionnaire
                </Typography>
            );
        }

        if (isLoading || submitIsLoading || finishTaskIsLoading) {
            return <CircularProgress sx={{ m: '2rem' }} />;
        }

        if (submitSuccess && finishTaskSuccess) {
            return (
                <Typography sx={{ ml: '.5rem' }} variant="h6">
                    Response submitted
                </Typography>
            );
        }

        return (
            <>
                <Container maxWidth="md" sx={{ marginTop: '25px' }}>
                    <Form
                        validator={validator}
                        schema={rawSchema as RJSFSchema}
                        uiSchema={generatedSchema}
                        onSubmit={handleSubmit}
                        formData={formData}
                        onChange={(form: IChangeEvent) => setFormData(form.formData)}
                    />
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

export default FormFill;
