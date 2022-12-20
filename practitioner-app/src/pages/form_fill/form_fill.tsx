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
        console.log('data', data);
        console.log('resData', resData);
        if (!data) return;
        console.log('resData.formData', resData.formData);
        console.log('rawSchema', rawSchema);
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
        if (isLoading || !rawSchema) {
            return <CircularProgress sx={{ m: '2rem' }} />;
        }

        if (!data || error) {
            console.log(JSON.stringify(error));
            return (
                <Typography sx={{ ml: '.5rem' }} variant="h6">
                    Could not load questionnaire
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
