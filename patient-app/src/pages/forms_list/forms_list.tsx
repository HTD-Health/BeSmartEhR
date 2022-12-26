import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import { Button, CircularProgress, Grid, IconButton, Pagination, Typography } from '@mui/material';
import type { Task } from 'fhir/r4';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';

import { PaginationParams, TaskParams } from '../../api/api';
import SmartAppBar from '../../components/smart_app_bar/smart_app_bar';
import TaskItem from '../../components/task_item/task_item';
import { getIdFromReference } from '../../utils/reference';

import { getTasksQuery } from 'api/queries';
import AlertSnackbar from 'components/error_snackbar/error_snackbar';

const TASKS_PER_PAGE = 5;

const FormsList = ({ status, sort }: TaskParams): JSX.Element => {
    const [page, setPage] = useState(1);
    const [paginationData, setPaginationData] = useState<PaginationParams | undefined>(undefined);
    const [errorSnackbar, setErrorSnackbar] = useState(false);
    const navigate = useNavigate();
    const assignedMode = status === 'ready';

    const { data, isLoading, isSuccess, error } = useQuery(
        getTasksQuery(
            {
                status,
                sort
            },
            TASKS_PER_PAGE,
            paginationData
        )
    );

    useEffect(() => {
        if (error) {
            setErrorSnackbar(true);
            console.error(error);
        }
    }, [error]);

    useEffect(() => {
        if (isSuccess && data?.total && data?.id) {
            setPaginationData({ bundleId: data?.id, page });
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
            {assignedMode ? 'Assigned forms' : 'Filled forms'}
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
                {data?.entry?.map((entryItem) => {
                    const task = entryItem.resource as Task;
                    const responseId = getIdFromReference(task.focus);
                    const actionButton = responseId ? (
                        <Button
                            sx={{ whiteSpace: 'nowrap' }}
                            variant="text"
                            onClick={() => navigate(`${responseId}/view`)}
                            endIcon={<ArrowRightAltIcon />}
                        >
                            Show
                        </Button>
                    ) : (
                        <IconButton disabled>
                            <NotInterestedIcon />
                        </IconButton>
                    );
                    return (
                        <TaskItem key={task.id} task={task} actionButton={assignedMode ? undefined : actionButton} />
                    );
                })}
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
