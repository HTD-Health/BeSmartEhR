import {QuestionnaireItem} from "fhir/r5";

export const fieldTypesMapping: any = {
    string: {
        type: 'string'
    },
    text: {
        type: 'string'
    },
    url: {
        type: 'string',
        format: 'uri'
    },
    boolean: {
        type: 'boolean'
    },
    integer: {
        type: 'integer'
    },
    decimal: {
        type: 'number'
    },
    date: {
        type: 'string',
        format: 'date'
    },
    dateTime: {
        type: 'string',
        format: 'date-time'
    },
    time: {
        type: 'string',
        format: 'time'
    },
    group: {
        type: 'object'
    },
    choice: (item: QuestionnaireItem) => {
        if (!item.answerOption) {
            return {
                'type': 'string'
            }
        }

        const enums = [];
        const enumsNames = [];

        for (const option of item.answerOption) {
            if (!option.valueCoding) {
                continue;
            }
            enums.push(option.valueCoding.code);

            const prefixExtension = option.extension?.find(extension => extension.url === 'http://hl7.org/fhir/StructureDefinition/questionnaire-optionPrefix');
            if (prefixExtension?.valueString) {
                enumsNames.push(prefixExtension?.valueString + '. ' + option.valueCoding.display);
            } else {
                enumsNames.push(option.valueCoding.display);
            }
        }

        return {
            'type': 'string',
            'enum': enums,
            'enumNames': enumsNames
        }
    }
}