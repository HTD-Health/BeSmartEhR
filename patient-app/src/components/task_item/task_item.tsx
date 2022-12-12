import { Card, Typography } from '@mui/material';
import type { Task } from 'fhir/r4';

type TaskItemProps = {
    task: Task;
    actionButton: JSX.Element;
};

const TaskItem = (props: TaskItemProps): JSX.Element => {
    const { task, actionButton } = props;

    return (
        <Card
            sx={{
                m: '.5rem',
                p: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                border: 0.5,
                borderColor: 'grey.500'
            }}
        >
            <Typography variant="h6" color="inherit" noWrap>
                {task?.description || 'Form name not specified'}
            </Typography>
            {actionButton}
        </Card>
    );
};

export default TaskItem;
