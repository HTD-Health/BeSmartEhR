import { Questionnaire } from "fhir/r4";
import { toJSONSchema } from "./schema";
import * as questionnaire from "./testQuestionnaire.json";

test("Test generating schema", () => {
  const [, uiSchema] = toJSONSchema(questionnaire as Questionnaire);
  console.log(JSON.stringify(uiSchema, null, 2));
});
