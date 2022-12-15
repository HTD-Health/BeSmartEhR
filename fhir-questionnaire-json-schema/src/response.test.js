"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const questionnaire = require("./testQuestionnaire.json");
const response_1 = require("./response");
test("Test response", () => {
    const schema = (0, response_1.toQuestionnaireResponse)(questionnaire, { "/54126-8": { "/54126-8/54134-2": ["LA6156-9", "LA10617-1"] } });
    console.log(JSON.stringify(schema, null, 2));
});
