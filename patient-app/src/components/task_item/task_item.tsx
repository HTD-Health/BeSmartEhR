import { Box, Card, Typography } from '@mui/material';
import { format } from 'date-fns';
import type { Task } from 'fhir/r4';

type TaskItemProps = {
    task: Task;
    actionButton?: JSX.Element;
};

const TaskItem = (props: TaskItemProps): JSX.Element => {
    const { task, actionButton } = props;
    const assignedMode = task.status === 'ready';

    const actionTaken = {
        actionName: assignedMode ? 'Assigned' : 'Completed',
        date: assignedMode ? task.authoredOn : task.lastModified,
        by: task.owner?.reference
    };

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
                {task.description || 'Form name not specified'}
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
                {actionTaken?.date && (
                    <Typography variant="body2" color="inherit">
                        {actionTaken.actionName} on: {format(new Date(actionTaken.date), 'iii, MM/dd/yyyy HH:mm:ss')}
                    </Typography>
                )}
                <Typography variant="body2" color="inherit" noWrap>
                    {actionTaken.actionName} by: {actionTaken.by || 'Issuer not specified'}
                </Typography>
            </Box>
            {actionButton && (
                <Box minWidth="80px" display="flex" justifyContent="center">
                    {actionButton}
                </Box>
            )}
        </Card>
    );
};

export default TaskItem;
