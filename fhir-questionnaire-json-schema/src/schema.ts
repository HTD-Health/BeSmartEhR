import { Questionnaire, QuestionnaireItem } from "fhir/r4";
import { QuestionnaireResponse } from "fhir/r5";
import { Schema } from "jsonschema";
import { fieldTypesMapping, valueFieldToValue } from "./fields";

export const responseToJSONSchema = (
  questionnaireResponse: QuestionnaireResponse
): any => {
  if (!questionnaireResponse.item || questionnaireResponse.item.length < 1)
    return;

  const properties: any = {};
  for (const item of questionnaireResponse.item) {
    if (!item.answer || item.answer.length < 1) continue;
    const answerObj = item.answer[0];
    properties[item.linkId] = valueFieldToValue(answerObj);
  }

  return properties;
};

export const toJSONSchema = (questionnaire: Questionnaire): [Schema, any] => {
  const schema: Schema = {
    type: "object",
  };
  let uiSchema;

  if (questionnaire.title) {
    schema.title = questionnaire.title;
  }
  if (questionnaire.description) {
    schema.description = questionnaire.description;
  }
  if (questionnaire.item) {
    schema.properties = generateItems(questionnaire.item);
    schema.required = questionnaire.item
      .filter((subItem) => subItem.required === true)
      .map((subItem) => subItem.linkId);

    uiSchema = generateUISchemaItems(questionnaire.item);
  }

  return [schema, uiSchema];
};

const generateItems = (items: QuestionnaireItem[]): any => {
  const properties: any = {};
  for (const item of items) {
    properties[item.linkId] = generateItem(item);
  }
  return properties;
};

const generateItem = (item: QuestionnaireItem): Schema => {
  const result = {};

  let fieldMapping = fieldTypesMapping[item.type];
  if (typeof fieldMapping === "function") {
    fieldMapping = fieldMapping(item, result);
  }

  const entry = {
    ...(fieldMapping || fieldTypesMapping["string"]),
  };

  if (item.item) {
    entry.title = "";
    entry.properties = generateItems(item.item);
    entry.required = item.item
      .filter((subItem) => subItem.required === true)
      .map((subItem) => subItem.linkId);
  }

  if (item.repeats) {
    return {
      type: "array",
      title: item.text,
      items: entry,
      ...(entry.enum ? { uniqueItems: true } : {}),
    };
  } else {
    entry.title = item.text;
  }

  return entry;
};

const generateUISchemaItems = (items: QuestionnaireItem[]): any => {
  const properties: any = {};
  for (const item of items) {
    properties[item.linkId] = generateUISchemaItem(item);
  }
  return properties;
};

const generateUISchemaItem = (item: QuestionnaireItem): any => {
  const entry = {
    "ui:placeholder": "",
  } as any;

  const unitExtension = item.extension?.find(
    (extension) =>
      extension.url ===
      "http://hl7.org/fhir/StructureDefinition/questionnaire-unit"
  );
  if (unitExtension) {
    if (unitExtension?.valueCoding?.code) {
      entry["ui:placeholder"] = unitExtension?.valueCoding?.code;
    }
  }

  if (item.item) {
    entry["ui:options"] = generateUISchemaItems(item.item);

    const displays = item.item.filter((e) => e.type === "display");
    for (const display of displays) {
      const displayExtension = display.extension?.find(
        (e) =>
          e.url ===
          "http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl"
      );
      if (
        displayExtension?.valueCodeableConcept?.coding?.find(
          (e) => e.code === "help"
        )
      ) {
        entry["ui:help"] = display.text;
      }
    }
  }

  return entry;
};
