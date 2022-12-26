"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("./schema");
const questionnaire = require("./testQuestionnaire.json");
test("Test generating schema", () => {
    const [, uiSchema] = (0, schema_1.toJSONSchema)(questionnaire);
    console.log(JSON.stringify(uiSchema, null, 2));
});
