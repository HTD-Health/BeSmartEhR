import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { Button, CircularProgress, Grid, Pagination, Typography } from '@mui/material';
import type { Task } from 'fhir/r4';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';

import { TaskParams } from '../../api/api';
import SmartAppBar from '../../components/smart_app_bar/smart_app_bar';
import TaskItem from '../../components/task_item/task_item';

import { getTasksQuery } from 'api/queries';
import AlertSnackbar from 'components/error_snackbar/error_snackbar';

const TASKS_PER_PAGE = 3;

const FormsList = ({ status, sort }: TaskParams): JSX.Element => {
    const [page, setPage] = useState(1);
    const [bundleId, setBundleId] = useState<string | undefined>(undefined);
    const [errorSnackbar, setErrorSnackbar] = useState(false);

    const { data, isLoading, isSuccess, error } = useQuery(
        getTasksQuery(
            {
                status,
                sort
            },
            {
                bundleId,
                page,
                itemsPerPage: TASKS_PER_PAGE
            }
        )
    );

    useEffect(() => {
        if (error) {
            setErrorSnackbar(true);
            console.error(error);
        }
    }, [error]);

    useEffect(() => {
        if (isSuccess && data?.total && page === 1) {
            setBundleId(data?.id);
        }
    }, [isSuccess, data, page]);

    const getTotalPagesCount = (): number => {
        if (data?.total) {
            const pages = Math.floor(data.total / TASKS_PER_PAGE);
            return data.total % TASKS_PER_PAGE ? pages + 1 : pages;
        }
        return 0;
    };

    const renderTitle = (): JSX.Element => (
        <Typography sx={{ ml: '.5rem', my: '1.5rem' }} variant="h4" color="inherit" noWrap>
            {status === 'ready' ? 'Assigned forms' : 'Filled forms'}
        </Typography>
    );

    const renderContent = (): JSX.Element => {
        if (isLoading) {
            return <CircularProgress sx={{ m: '2rem' }} />;
        }

        if (!data || !Array.isArray(data.entry) || data.entry.length === 0) {
            return (
                <Typography sx={{ ml: '.5rem' }} variant="h6">
                    No forms found
                </Typography>
            );
        }

        return (
            <>
                {data?.entry?.map((entryItem) => (
                    <TaskItem
                        key={(entryItem.resource as Task).id}
                        task={entryItem.resource as Task}
                        actionButton={
                            status === 'ready' ? (
                                <Button sx={{ whiteSpace: 'nowrap' }} variant="text" endIcon={<ArrowRightAltIcon />}>
                                    Fill out
                                </Button>
                            ) : (
                                <Button sx={{ whiteSpace: 'nowrap' }} variant="text" endIcon={<ArrowRightAltIcon />}>
                                    Show
                                </Button>
                            )
                        }
                    />
                ))}
            </>
        );
    };

    const renderPagination = (): JSX.Element => (
        <Pagination
            size="large"
            color="primary"
            count={getTotalPagesCount()}
            page={page}
            onChange={(_: React.ChangeEvent<unknown>, value: number) => setPage(value)}
        />
    );

    return (
        <>
            <SmartAppBar />
            <AlertSnackbar
                open={errorSnackbar}
                onClose={() => setErrorSnackbar(false)}
                message="Failed to get patient data"
            />
            {renderTitle()}
            <Grid container spacing={2} justifyContent="center">
                <>
                    <Grid item xs={12}>
                        {renderContent()}
                    </Grid>
                    <Grid item>{renderPagination()}</Grid>
                </>
            </Grid>
        </>
    );
};

export default FormsList;
