import * as questionnaire from './testQuestionnaire.json';
import {Questionnaire} from "fhir/r4";
import {toQuestionnaireResponse} from "./response";

test("Test response", () => {
    const schema = toQuestionnaireResponse(questionnaire as Questionnaire, {"/54126-8":{"/54126-8/54134-2":["LA6156-9","LA10617-1"]}});
    console.log(JSON.stringify(schema, null, 2))
});
