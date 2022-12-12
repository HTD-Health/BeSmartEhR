import { useState, useMemo } from 'react';
import { Typography } from '@mui/material';

import FormsPage from './forms_page';

import SmartAppBar from 'components/smart_app_bar/smart_app_bar';
import AlertSnackbar from 'components/error_snackbar/error_snackbar';
import { FormsContext } from 'hooks/useFormsData';

const FormsContainer = (): JSX.Element => {
    const [formsToAssign, setFormsToAssign] = useState<string[]>([]);
    const [errorSnackbar, setErrorSnackbar] = useState<boolean>(false);

    const value = useMemo(
        () => ({
            formsToAssign,
            errorSnackbar,
            setFormsToAssign,
            setErrorSnackbar
        }),
        [formsToAssign, errorSnackbar, setFormsToAssign, setErrorSnackbar]
    );

    return (
        <>
            <SmartAppBar />
            <AlertSnackbar
                open={errorSnackbar}
                onClose={() => setErrorSnackbar(false)}
                message="Failed to get patient data"
            />
            <Typography sx={{ ml: '.5rem', my: '1.5rem' }} variant="h4" color="inherit" noWrap>
                Questionnaires
            </Typography>
            <Typography sx={{ ml: '.5rem' }} variant="h6" color="inherit" noWrap>
                Questionnaires marked to assign: {formsToAssign.length}
            </Typography>
            <FormsContext.Provider value={value}>
                <FormsPage />
            </FormsContext.Provider>
        </>
    );
};

export default FormsContainer;
