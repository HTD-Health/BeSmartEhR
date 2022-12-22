import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { Box, Button, Card, Typography } from '@mui/material';
import { format } from 'date-fns';
import type { Task } from 'fhir/r4';
import { useNavigate } from 'react-router-dom';

type AssignedFormItemProps = {
    name: string;
    task?: Task;
    questionnaireId?: string;
};

const AssignedFormItem = (props: AssignedFormItemProps): JSX.Element => {
    const { name, task, questionnaireId } = props;
    const navigate = useNavigate();

    return (
        <Card
            sx={{
                m: '.5rem',
                p: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                border: 0.5,
                borderColor: 'grey.500'
            }}
        >
            <Typography variant="h6" color="inherit">
                {name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {task?.authoredOn && (
                    <Typography variant="body2" color="inherit">
                        Assigned on: {format(new Date(task.authoredOn), 'iii, MM/dd/yyyy HH:mm:ss')}
                    </Typography>
                )}
                {questionnaireId && (
                    <Button
                        sx={{ whiteSpace: 'nowrap' }}
                        variant="text"
                        onClick={() =>
                            navigate(`${questionnaireId}/fill`, {
                                state: {
                                    taskId: task?.id
                                }
                            })
                        }
                        endIcon={<ArrowRightAltIcon />}
                    >
                        Fill out
                    </Button>
                )}
            </Box>
        </Card>
    );
};

export default AssignedFormItem;
