import { Grid2, Pagination, Typography } from '@mui/material';
import { JSX, useEffect, useState } from 'react';

import FilledFormsPage from './filled_forms_page';

import { useGetFilledForms } from '@/api/queries';
import CustomSnackbar from '@/components/custom_snackbar/custom_snackbar';
import SmartAppBar from '@/components/smart_app_bar/smart_app_bar';
import calculatePagesCount from '@/utils/calculate_total';

const RESPONSES_PER_PAGE = 5;

const FilledFormsContainer = (): JSX.Element => {
    const [bundleId, setBundleId] = useState<string | undefined>(undefined);
    const [page, setPage] = useState(1);
    const [resultsInTotal, setResultsInTotal] = useState<number>(0);
    const [errorSnackbar, setErrorSnackbar] = useState<boolean>(false);

    const { data, isSuccess, isLoading, error } = useGetFilledForms({
        bundleId,
        page,
        recordsPerPage: RESPONSES_PER_PAGE
    });

    useEffect(() => {
        if (isSuccess && data?.total && page === 1) {
            const pages = calculatePagesCount(data.total, RESPONSES_PER_PAGE);
            setResultsInTotal(pages);
            setBundleId(data?.id);
        }
    }, [isSuccess, data, page]);

    useEffect(() => {
        if (error) {
            setErrorSnackbar(true);
            console.error(error);
        }
    }, [error]);

    return (
        <>
            <SmartAppBar />
            <CustomSnackbar
                open={errorSnackbar}
                onClose={() => setErrorSnackbar(false)}
                message="Failed to get filled forms"
            />
            <Typography sx={{ ml: '.5rem', my: '1.5rem' }} variant="h4" color="inherit" noWrap>
                Filled forms
            </Typography>
            <Grid2 container spacing={2} justifyContent="center">
                <Grid2 size={12}>
                    <FilledFormsPage data={data} isLoading={isLoading} />
                </Grid2>
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

export default FilledFormsContainer;
