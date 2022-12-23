import NotInterestedIcon from '@mui/icons-material/NotInterested';
import { Box, Card, IconButton, Typography } from '@mui/material';
import { format } from 'date-fns';
import type { Task } from 'fhir/r4';

type TaskItemProps = {
    task: Task;
    actionButton?: JSX.Element;
};

const TaskItem = (props: TaskItemProps): JSX.Element => {
    const { task, actionButton } = props;
    const completedTask = task.status === 'completed';

    const actionName = completedTask ? 'Completed' : 'Assigned';

    return (
        <Card
            sx={{
                m: '.5rem',
                p: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                border: 0.5,
                borderColor: 'grey.500',
                gap: '1rem'
            }}
        >
            <Typography variant="h6" color="inherit">
                {task?.description || 'Form name not specified'}
            </Typography>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    marginLeft: 'auto',
                    alignItems: 'flex-end',
                    gap: '0.5rem'
                }}
            >
                {task?.authoredOn && (
                    <Typography variant="body2" color="inherit">
                        {actionName} on: {format(new Date(task.authoredOn), 'iii, MM/dd/yyyy HH:mm:ss')}
                    </Typography>
                )}
                <Typography variant="body2" color="inherit" noWrap>
                    {actionName} by: {task?.owner?.reference || 'Issuer not specified'}
                </Typography>
            </Box>
            {completedTask ? (
                <Box minWidth="80px" display="flex" justifyContent="center">
                    {actionButton ?? (
                        <IconButton disabled>
                            <NotInterestedIcon />
                        </IconButton>
                    )}
                </Box>
            ) : undefined}
        </Card>
    );
};

export default TaskItem;
