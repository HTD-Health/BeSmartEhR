import {Container} from "@mui/material";
import Form from "@rjsf/mui";
import validator from "@rjsf/validator-ajv8";
import {RJSFSchema} from "@rjsf/utils";
import {IChangeEvent} from "@rjsf/core";
import {toJSONSchema} from "fhir-questionnaire-json-schema/src/schema";
// eslint-disable-next-line import/no-unresolved
import {Questionnaire} from "fhir/r4";
import {toQuestionnaireResponse} from "fhir-questionnaire-json-schema/src/response";

import TestQuestionnaire1 from "./test_questionnaire";

import SmartAppBar from 'components/smart_app_bar/smart_app_bar';

const FillForm = (): JSX.Element => {
    const handleSubmit = (data: IChangeEvent): void => {
        console.log(toQuestionnaireResponse(TestQuestionnaire1 as Questionnaire, data.formData))
    }

    const [schema, uiSchema] = toJSONSchema(TestQuestionnaire1 as Questionnaire);

    return <>
        <SmartAppBar/>
        <Container maxWidth="md" sx={{marginTop: '25px'}}>
            <Form
                validator={validator}
                schema={schema as RJSFSchema}
                uiSchema={uiSchema}
                onSubmit={handleSubmit}
            />
        </Container>
    </>
}

export default FillForm;