"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toQuestionnaireResponse = void 0;
const toQuestionnaireResponse = (questionnaire, data) => {
    const response = {
        resourceType: "QuestionnaireResponse",
        status: "completed",
        item: [],
    };
    traverse(data, questionnaire.item, response);
    return response;
};
exports.toQuestionnaireResponse = toQuestionnaireResponse;
const traverse = (node, questionnaireItems, parent) => {
    var _a, _b;
    for (const [key, value] of Object.entries(node)) {
        const item = questionnaireItems.find(e => e.linkId === key);
        if (!item) {
            continue;
        }
        if (item.type === 'group') {
            if (item.repeats && Array.isArray(value)) {
                for (const entry of value) {
                    const newItem = {
                        linkId: key
                    };
                    if (item.item) {
                        traverse(entry, item.item, newItem);
                    }
                    parent.item = [...(parent.item || []), newItem];
                }
            }
            else {
                const newItem = {
                    linkId: key
                };
                if (item.item) {
                    if (Array.isArray(value)) {
                        for (const entry of value) {
                            traverse(entry, item.item, newItem);
                        }
                    }
                    else {
                        traverse(value, item.item, newItem);
                    }
                }
                parent.item = [...(parent.item || []), newItem];
            }
        }
        else {
            const newItem = {
                linkId: key,
                answer: []
            };
            if (Array.isArray(value)) {
                for (const entry of value) {
                    (_a = newItem.answer) === null || _a === void 0 ? void 0 : _a.push(generateAnswer(item, entry));
                }
            }
            else {
                (_b = newItem.answer) === null || _b === void 0 ? void 0 : _b.push(generateAnswer(item, value));
            }
            parent.item = [...(parent.item || []), newItem];
        }
    }
};
const generateAnswer = (questionnaireDefinition, value) => {
    var _a, _b, _c, _d;
    if (questionnaireDefinition.type === 'date') {
        return {
            valueDate: value
        };
    }
    else if (questionnaireDefinition.type === 'boolean') {
        return {
            valueBoolean: value
        };
    }
    else if (questionnaireDefinition.type === 'decimal') {
        return {
            valueDecimal: value
        };
    }
    else if (questionnaireDefinition.type === 'integer') {
        return {
            valueInteger: value
        };
    }
    else if (questionnaireDefinition.type === 'dateTime') {
        return {
            valueDateTime: value
        };
    }
    else if (questionnaireDefinition.type === 'time') {
        return {
            valueTime: value
        };
    }
    else if (questionnaireDefinition.type === 'url') {
        return {
            valueUri: value
        };
    }
    else if (questionnaireDefinition.type === 'attachment') {
        return {
            valueAttachment: value
        };
    }
    else if (questionnaireDefinition.type === 'quantity') {
        return {
            valueQuantity: value
        };
    }
    else if (questionnaireDefinition.type === 'choice') {
        const option = (_a = questionnaireDefinition.answerOption) === null || _a === void 0 ? void 0 : _a.find(e => {
            var _a;
            return ((_a = e.valueCoding) === null || _a === void 0 ? void 0 : _a.code) === value;
        });
        return {
            valueCoding: {
                code: value,
                display: (_b = option === null || option === void 0 ? void 0 : option.valueCoding) === null || _b === void 0 ? void 0 : _b.display
            }
        };
    }
    else if (questionnaireDefinition.type === 'open-choice') {
        const option = (_c = questionnaireDefinition.answerOption) === null || _c === void 0 ? void 0 : _c.find(e => {
            var _a;
            return ((_a = e.valueCoding) === null || _a === void 0 ? void 0 : _a.code) === value;
        });
        if (option) {
            return {
                valueCoding: {
                    code: value,
                    display: (_d = option === null || option === void 0 ? void 0 : option.valueCoding) === null || _d === void 0 ? void 0 : _d.display
                }
            };
        }
        else {
            return {
                valueString: value
            };
        }
    }
    return {
        valueString: value
    };
};
