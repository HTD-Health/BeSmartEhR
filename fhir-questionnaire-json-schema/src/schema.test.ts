import {toJSONSchema} from "./schema";
import * as questionnaire from './testQuestionnaire.json';
import {Questionnaire} from "fhir/r4";

test("Test generating schema", () => {
    const [schema, uiSchema] = toJSONSchema(questionnaire as Questionnaire);
    // console.log(JSON.stringify(schema, null, 2))
    console.log(JSON.stringify(uiSchema, null, 2))
});
