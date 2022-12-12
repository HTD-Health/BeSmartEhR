import { useContext, createContext, Dispatch, SetStateAction } from 'react';

interface FormsContextInterface {
    bundleId: string | undefined;
    page: number;
    formsToAssign: string[];
    setBundleId: Dispatch<SetStateAction<string | undefined>>;
    setFormsToAssign: Dispatch<SetStateAction<string[]>>;
    setErrorSnackbar: Dispatch<SetStateAction<boolean>>;
    setResultsInTotal: Dispatch<SetStateAction<number>>;
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
