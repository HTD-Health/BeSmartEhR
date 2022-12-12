import { useState, useMemo } from 'react';
import { Grid, Typography, Button, Box } from '@mui/material';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';

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

    const renderMultipleAssignBar = (): JSX.Element => (
        <Grid container spacing={2} px=".5rem">
            <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex' }}>
                    <Typography variant="h6" color="inherit" noWrap>
                        Marked to assign: {formsToAssign.length}
                    </Typography>
                    <Button onClick={() => setFormsToAssign([])} sx={{ minHeight: 0, minWidth: 0, padding: 0 }}>
                        <DisabledByDefaultIcon color="action" />
                    </Button>
                </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                    <Button
                        variant="contained"
                        onClick={() => {
                            // prepared for multiple assign feature
                            console.log(JSON.stringify(formsToAssign));
                        }}
                    >
                        Assign multiple
                    </Button>
                </Box>
            </Grid>
        </Grid>
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
            {formsToAssign.length > 0 && renderMultipleAssignBar()}
            <FormsContext.Provider value={value}>
                <FormsPage />
            </FormsContext.Provider>
        </>
    );
};

export default FormsContainer;
