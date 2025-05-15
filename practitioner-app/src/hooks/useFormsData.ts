import type { Bundle, FhirResource } from 'fhir/r4';
import { createContext, Dispatch, SetStateAction, useContext } from 'react';

import type { FormMeta } from '@/api/models';

interface FormsContextInterface {
    data: Bundle<FhirResource> | undefined;
    isLoading: boolean;
    formsToAssign: FormMeta[];
    setFormsToAssign: Dispatch<SetStateAction<FormMeta[]>>;
}

const FormsContext = createContext<FormsContextInterface>({} as FormsContextInterface);

const useFormsData = (): FormsContextInterface => {
    const formsContext = useContext(FormsContext);

    if (!formsContext) {
        throw new Error('useFormsData must be used within a <FormsContainer />');
    }
    return formsContext;
};

export { FormsContext, FormsContextInterface, useFormsData };
