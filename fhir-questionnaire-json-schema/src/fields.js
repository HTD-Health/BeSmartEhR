"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.valueFieldToValue = exports.fieldTypesMapping = void 0;
exports.fieldTypesMapping = {
    string: {
        type: "string",
    },
    text: {
        type: "string",
    },
    url: {
        type: "string",
        format: "uri",
    },
    boolean: {
        type: "boolean",
    },
    integer: {
        type: "integer",
    },
    decimal: {
        type: "number",
    },
    date: {
        type: "string",
        format: "date",
    },
    dateTime: {
        type: "string",
        format: "date-time",
    },
    time: {
        type: "string",
        format: "time",
    },
    group: {
        type: "object",
    },
    choice: (item) => {
        var _a;
        if (!item.answerOption) {
            return {
                type: "string",
            };
        }
        const enums = [];
        const enumsNames = [];
        for (const option of item.answerOption) {
            if (!option.valueCoding) {
                continue;
            }
            enums.push(option.valueCoding.code);
            const prefixExtension = (_a = option.extension) === null || _a === void 0 ? void 0 : _a.find((extension) => extension.url ===
                "http://hl7.org/fhir/StructureDefinition/questionnaire-optionPrefix");
            if (prefixExtension === null || prefixExtension === void 0 ? void 0 : prefixExtension.valueString) {
                enumsNames.push((prefixExtension === null || prefixExtension === void 0 ? void 0 : prefixExtension.valueString) + ". " + option.valueCoding.display);
            }
            else {
                enumsNames.push(option.valueCoding.display);
            }
        }
        return {
            type: "string",
            enum: enums,
            enumNames: enumsNames,
        };
    },
};
const valueFieldToValue = (obj) => {
    const fieldNames = Object.getOwnPropertyNames(obj);
    const valueField = fieldNames.find((fieldName) => fieldName.startsWith("value"));
    if (!valueField)
        return;
    if (valueField === "valueCoding") {
        return obj.valueCoding.code;
    }
    return obj[simpleValueFieldsMapping[valueField]];
};
exports.valueFieldToValue = valueFieldToValue;
const simpleValueFieldsMapping = {
    valueDate: "valueDate",
    valueDateTime: "valueDateTime",
    valueDecimal: "valueDecimal",
    valueInteger: "valueInteger",
    valueString: "valueString",
    valueTime: "valueTime",
    valueUri: "valueUri",
    valueBoolean: "valueBoolean",
    valueAttachment: "valueAttachment",
    valueQuantity: "valueQuantity",
    valueReference: "valueReference",
};
