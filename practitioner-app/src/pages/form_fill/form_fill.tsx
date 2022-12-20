import { CircularProgress, Container, Typography } from '@mui/material';
import { IChangeEvent } from '@rjsf/core';
import Form from '@rjsf/mui';
import { RJSFSchema } from '@rjsf/utils';
import validator from '@rjsf/validator-ajv8';
import { toQuestionnaireResponse } from 'fhir-questionnaire-json-schema/src/response';
import { toJSONSchema } from 'fhir-questionnaire-json-schema/src/schema';
// eslint-disable-next-line import/no-unresolved
import { Schema } from 'jsonschema';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useGetQuestionnaire } from '../../api/queries';

import SmartAppBar from 'components/smart_app_bar/smart_app_bar';

const FormFill = (): JSX.Element => {
    const handleSubmit = (resData: IChangeEvent): void => {
        if (!data) return;
        console.log(toQuestionnaireResponse(data, resData.formData));
    };

    const { id } = useParams();
    const [rawSchema, setRawSchema] = useState<Schema>();
    const [generatedSchema, setGeneratedSchema] = useState();

    const { data, isLoading, error, isSuccess } = useGetQuestionnaire(id ?? '');

    useEffect(() => {
        if (!data || !isSuccess) return;
        const [schema, uiSchema] = toJSONSchema(data);

        setRawSchema(schema);
        setGeneratedSchema(uiSchema);
    }, [data, isSuccess]);

    const renderContent = (): JSX.Element => {
        if (error || (!rawSchema && !isLoading)) {
            return (
                <Typography sx={{ ml: '.5rem' }} variant="h6">
                    Could not load questionnaire
                </Typography>
            );
        }

        if (isLoading) {
            return <CircularProgress sx={{ m: '2rem' }} />;
        }

        return (
            <>
                <Container maxWidth="md" sx={{ marginTop: '25px' }}>
                    <Form
                        validator={validator}
                        schema={rawSchema as RJSFSchema}
                        uiSchema={generatedSchema}
                        onSubmit={handleSubmit}
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
