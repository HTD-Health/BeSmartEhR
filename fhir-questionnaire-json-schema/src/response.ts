import {
    Questionnaire,
    QuestionnaireItem,
    QuestionnaireResponse,
    QuestionnaireResponseItem,
    QuestionnaireResponseItemAnswer
} from "fhir/r4";

export const toQuestionnaireResponse = (questionnaire: Questionnaire, data: any): QuestionnaireResponse => {
    const response: QuestionnaireResponse = {
        resourceType: "QuestionnaireResponse",
        status: "completed",
        item: [],
    }

    traverse(data, questionnaire.item!!, response);
    return response
}

const traverse = (node: object, questionnaireItems: QuestionnaireItem[], parent: QuestionnaireResponseItem | QuestionnaireResponse) => {
    for (const [key, value] of Object.entries(node)) {
        const item = questionnaireItems.find(e => e.linkId === key);
        if (!item) {
            continue
        }

        if (item.type === 'group') {
            if (item.repeats && Array.isArray(value)) {
                for (const entry of value) {
                    const newItem = {
                        linkId: key
                    }

                    if (item.item) {
                        traverse(entry, item.item, newItem)
                    }
                    parent.item = [...(parent.item || []), newItem]
                }
            } else {
                const newItem = {
                    linkId: key
                }

                if (item.item) {
                    if (Array.isArray(value)) {
                        for (const entry of value) {
                            traverse(entry, item.item, newItem)
                        }
                    } else {
                        traverse(value, item.item, newItem)
                    }
                }
                parent.item = [...(parent.item || []), newItem]
            }
        } else {
            const newItem: QuestionnaireResponseItem = {
                linkId: key,
                answer: []
            }

            if (Array.isArray(value)) {
                for (const entry of value) {
                    newItem.answer?.push(generateAnswer(item, entry))
                }
            } else {
                newItem.answer?.push(generateAnswer(item, value))
            }

            parent.item = [...(parent.item || []), newItem]
        }
    }
}

const generateAnswer = (questionnaireDefinition: QuestionnaireItem, value: any): QuestionnaireResponseItemAnswer => {
    if (questionnaireDefinition.type === 'date') {
        return {
            valueDate: value
        }
    } else if (questionnaireDefinition.type === 'boolean') {
        return {
            valueBoolean: value
        }
    } else if (questionnaireDefinition.type === 'decimal') {
        return {
            valueDecimal: value
        }
    } else if (questionnaireDefinition.type === 'integer') {
        return {
            valueInteger: value
        }
    } else if (questionnaireDefinition.type === 'dateTime') {
        return {
            valueDateTime: value
        }
    } else if (questionnaireDefinition.type === 'time') {
        return {
            valueTime: value
        }
    } else if (questionnaireDefinition.type === 'url') {
        return {
            valueUri: value
        }
    } else if (questionnaireDefinition.type === 'attachment') {
        return {
            valueAttachment: value
        }
    } else if (questionnaireDefinition.type === 'quantity') {
        return {
            valueQuantity: value
        }
    } else if (questionnaireDefinition.type === 'choice') {
        const option = questionnaireDefinition.answerOption?.find(e => {
            return e.valueCoding?.code === value
        })

        return {
            valueCoding: {
                code: value,
                display: option?.valueCoding?.display
            }
        }
    } else if (questionnaireDefinition.type === 'open-choice') {
        const option = questionnaireDefinition.answerOption?.find(e => {
            return e.valueCoding?.code === value
        })

        if (option) {
            return {
                valueCoding: {
                    code: value,
                    display: option?.valueCoding?.display
                }
            }
        } else {
            return {
                valueString: value
            }
        }
    }

    return {
        valueString: value
    }
}