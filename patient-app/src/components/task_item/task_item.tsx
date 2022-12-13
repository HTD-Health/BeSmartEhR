import { Box, Card, Typography } from '@mui/material';
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
                alignItems: 'end',
                border: 0.5,
                borderColor: 'grey.500'
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    m: '.5rem',
                    p: '1rem'
                }}
            >
                <Typography variant="h6" color="inherit" noWrap>
                    {task?.description || 'Form name not specified'}
                </Typography>
                <Typography variant="subtitle1" color="inherit" noWrap>
                    {task?.authoredOn || 'Date not specified'}
                </Typography>
                <Typography variant="subtitle1" color="inherit" noWrap>
                    {task?.owner?.reference || 'Issuer not specified'}
                </Typography>
            </Box>
            {actionButton}
        </Card>
    );
};

export default TaskItem;
