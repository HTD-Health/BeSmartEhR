// eslint-disable-next-line import/no-unresolved
import { Reference } from 'fhir/r4';

const getIdFromReference = (reference?: Reference): string | undefined => {
    if (reference && reference.reference) {
        const parts = reference.reference.split('/');
        if (parts.length >= 2) {
            return parts[parts.length - 1];
        }
    }
    return reference?.id;
};

// eslint-disable-next-line import/prefer-default-export
export { getIdFromReference };
