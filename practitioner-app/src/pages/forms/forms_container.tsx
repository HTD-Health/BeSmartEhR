import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import { Box, Button, Grid2, Pagination, Typography } from '@mui/material';
import { JSX, useEffect, useMemo, useState } from 'react';

import FormsPage from './forms_page';

import { FormMeta } from '@/api/models';
import { useAssignForms } from '@/api/mutations';
import { useGetQuestionnaires } from '@/api/queries';
import CustomSnackbar from '@/components/custom_snackbar/custom_snackbar';
import SmartAppBar from '@/components/smart_app_bar/smart_app_bar';
import { FormsContext } from '@/hooks/useFormsData';
import calculatePagesCount from '@/utils/calculate_total';

const QUESTIONNAIRES_PER_PAGE = 5;

const FormsContainer = (): JSX.Element => {
    const [bundleId, setBundleId] = useState<string | undefined>(undefined);
    const [page, setPage] = useState(1);
    const [resultsInTotal, setResultsInTotal] = useState<number>(0);
    const [formsToAssign, setFormsToAssign] = useState<FormMeta[]>([]);
    const [errorSnackbar, setErrorSnackbar] = useState<boolean>(false);

    const {
        data,
        isLoading: isQueryLoading,
        error: queryError,
        isSuccess: isQuerySuccess
    } = useGetQuestionnaires({
        bundleId,
        page,
        recordsPerPage: QUESTIONNAIRES_PER_PAGE
    });

    const {
        mutate: assign,
        error: mutationError,
        isPending: isMutationPending,
        isSuccess: isMutationSuccess
    } = useAssignForms();
    const [successSnackbar, setSuccessSnackbar] = useState(false);

    useEffect(() => {
        if (queryError || mutationError) {
            setErrorSnackbar(true);
            console.error(queryError ?? mutationError);
        }
    }, [queryError, mutationError]);

    useEffect(() => {
        if (isMutationSuccess) {
            setSuccessSnackbar(true);
        }
    }, [isMutationSuccess]);

    useEffect(() => {
        if (isQuerySuccess && data?.total && page === 1) {
            const pages = calculatePagesCount(data.total, QUESTIONNAIRES_PER_PAGE);
            setResultsInTotal(pages);
            setBundleId(data?.id);
        }
    }, [isQuerySuccess, data, page]);

    const value = useMemo(
        () => ({
            data,
            isLoading: isQueryLoading,
            formsToAssign,
            setFormsToAssign
        }),
        [data, isQueryLoading, formsToAssign, setFormsToAssign]
    );

    const renderMultipleAssignBar = (): JSX.Element => (
        <Grid2 container spacing={2} px=".5rem">
            <Grid2
                size={{
                    xs: 12,
                    sm: 6
                }}
            >
                <Box sx={{ display: 'flex' }}>
                    <Typography variant="h6" color="inherit" noWrap>
                        Marked to assign: {formsToAssign.length}
                    </Typography>
                    <Button onClick={() => setFormsToAssign([])} sx={{ minHeight: 0, minWidth: 0, padding: 0 }}>
                        <DisabledByDefaultIcon color="action" />
                    </Button>
                </Box>
            </Grid2>
            <Grid2
                size={{
                    xs: 12,
                    sm: 6
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                    <Button variant="contained" loading={isMutationPending} onClick={() => assign(formsToAssign)}>
                        Assign multiple
                    </Button>
                </Box>
            </Grid2>
        </Grid2>
    );

    const renderPage = (): JSX.Element => (
        <FormsContext.Provider value={value}>
            <FormsPage />
        </FormsContext.Provider>
    );

    return (
        <>
            <SmartAppBar />
            <CustomSnackbar
                key="error"
                open={errorSnackbar}
                onClose={() => setErrorSnackbar(false)}
                message={queryError ? 'Failed to get forms' : 'Failed to assign forms'}
            />
            <CustomSnackbar
                key="success"
                open={successSnackbar}
                severity="success"
                onClose={() => setSuccessSnackbar(false)}
                message="Forms assigned successfully"
            />
            <Typography sx={{ ml: '.5rem', my: '1.5rem' }} variant="h4" color="inherit" noWrap>
                Questionnaires
            </Typography>
            {formsToAssign.length > 0 && renderMultipleAssignBar()}
            <Grid2 container spacing={2} justifyContent="center">
                <Grid2 size={12}>{renderPage()}</Grid2>
                <Grid2>
                    <Pagination
                        size="large"
                        color="primary"
                        count={resultsInTotal}
                        page={page}
                        onChange={(_: React.ChangeEvent<unknown>, val: number) => setPage(val)}
                    />
                </Grid2>
            </Grid2>
        </>
    );
};

export default FormsContainer;
