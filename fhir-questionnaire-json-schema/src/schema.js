"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toJSONSchema = void 0;
const fields_1 = require("./fields");
const toJSONSchema = (questionnaire) => {
  const schema = {
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
exports.toJSONSchema = toJSONSchema;
const generateItems = (items) => {
  const properties = {};
  for (const item of items) {
    properties[item.linkId] = generateItem(item);
  }
  return properties;
};
const generateItem = (item) => {
  const result = {};
  let fieldMapping = fields_1.fieldTypesMapping[item.type];
  if (typeof fieldMapping === "function") {
    fieldMapping = fieldMapping(item, result);
  }
  const entry = Object.assign(
    {},
    fieldMapping || fields_1.fieldTypesMapping["string"]
  );
  if (item.item) {
    entry.title = "";
    entry.properties = generateItems(item.item);
    entry.required = item.item
      .filter((subItem) => subItem.required === true)
      .map((subItem) => subItem.linkId);
  }
  if (item.repeats) {
    return Object.assign(
      { type: "array", title: item.text, items: entry },
      entry.enum ? { uniqueItems: true } : {}
    );
  } else {
    entry.title = item.text;
  }
  return entry;
};
const generateUISchemaItems = (items) => {
  const properties = {};
  for (const item of items) {
    properties[item.linkId] = generateUISchemaItem(item);
  }
  return properties;
};
const generateUISchemaItem = (item) => {
  var _a, _b, _c, _d, _e, _f;
  const entry = {
    "ui:placeholder": "",
  };
  const unitExtension =
    (_a = item.extension) === null || _a === void 0
      ? void 0
      : _a.find(
          (extension) =>
            extension.url ===
            "http://hl7.org/fhir/StructureDefinition/questionnaire-unit"
        );
  if (unitExtension) {
    if (
      (_b =
        unitExtension === null || unitExtension === void 0
          ? void 0
          : unitExtension.valueCoding) === null || _b === void 0
        ? void 0
        : _b.code
    ) {
      entry["ui:placeholder"] =
        (_c =
          unitExtension === null || unitExtension === void 0
            ? void 0
            : unitExtension.valueCoding) === null || _c === void 0
          ? void 0
          : _c.code;
    }
  }
  if (item.item) {
    entry["ui:options"] = generateUISchemaItems(item.item);
    const displays = item.item.filter((e) => e.type === "display");
    for (const display of displays) {
      const displayExtension =
        (_d = display.extension) === null || _d === void 0
          ? void 0
          : _d.find(
              (e) =>
                e.url ===
                "http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl"
            );
      if (
        (_f =
          (_e =
            displayExtension === null || displayExtension === void 0
              ? void 0
              : displayExtension.valueCodeableConcept) === null || _e === void 0
            ? void 0
            : _e.coding) === null || _f === void 0
          ? void 0
          : _f.find((e) => e.code === "help")
      ) {
        entry["ui:help"] = display.text;
      }
    }
  }
  return entry;
};
