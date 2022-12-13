import { useState, useMemo, useEffect } from 'react';
import { Grid, Typography, Button, Box, Pagination } from '@mui/material';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';

import FormsPage from './forms_page';

import SmartAppBar from 'components/smart_app_bar/smart_app_bar';
import AlertSnackbar from 'components/error_snackbar/error_snackbar';
import { FormsContext } from 'hooks/useFormsData';
import { useGetQuestionnaires } from 'api/queries';

const questionnairesPerPage = 5;

const FormsContainer = (): JSX.Element => {
    const [bundleId, setBundleId] = useState<string | undefined>(undefined);
    const [page, setPage] = useState(1);
    const [resultsInTotal, setResultsInTotal] = useState<number>(0);
    const [formsToAssign, setFormsToAssign] = useState<string[]>([]);
    const [errorSnackbar, setErrorSnackbar] = useState<boolean>(false);

    const { data, isLoading, error, isSuccess } = useGetQuestionnaires({
        bundleId,
        page,
        questionnairesPerPage: 5
    });

    useEffect(() => {
        if (error) {
            setErrorSnackbar(true);
            console.error(error);
        }
    }, [error]);

    useEffect(() => {
        if (isSuccess && data?.total && page === 1) {
            const pages = Math.floor(data.total / questionnairesPerPage);
            const total = data.total % questionnairesPerPage ? pages + 1 : pages;
            setResultsInTotal(total);
            setBundleId(data?.id);
        }
    }, [isSuccess, data, page]);

    const value = useMemo(
        () => ({
            data,
            isLoading,
            formsToAssign,
            setFormsToAssign
        }),
        [data, isLoading, formsToAssign, setFormsToAssign]
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

    const renderPage = (): JSX.Element => (
        <FormsContext.Provider value={value}>
            <FormsPage />
        </FormsContext.Provider>
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

            <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12}>
                    {renderPage()}
                </Grid>
                <Grid item>
                    <Pagination
                        size="large"
                        color="primary"
                        count={resultsInTotal}
                        page={page}
                        onChange={(_: React.ChangeEvent<unknown>, val: number) => setPage(val)}
                    />
                </Grid>
            </Grid>
        </>
    );
};

export default FormsContainer;
