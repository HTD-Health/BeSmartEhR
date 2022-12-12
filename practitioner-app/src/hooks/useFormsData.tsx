import { useContext, createContext, Dispatch, SetStateAction } from 'react';

interface FormsContextInterface {
    formsToAssign: string[];
    setFormsToAssign: Dispatch<SetStateAction<string[]>>;
    setErrorSnackbar: Dispatch<SetStateAction<boolean>>;
}

const FormsContext = createContext<FormsContextInterface>({} as FormsContextInterface);

const useFormsData = (): FormsContextInterface => {
    const formsContext = useContext(FormsContext);

    if (!formsContext) {
        throw new Error('useFormsData must be used within a <FormsContainer />');
    }
    return formsContext;
};

export { FormsContext, useFormsData, FormsContextInterface };
