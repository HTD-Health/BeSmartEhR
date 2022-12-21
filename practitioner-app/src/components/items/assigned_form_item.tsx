import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { Box, Button, Card, Typography } from '@mui/material';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

type AssignedFormItemProps = {
    name: string;
    authoredOn?: string;
    questionnaireId?: string;
};

const AssignedFormItem = (props: AssignedFormItemProps): JSX.Element => {
    const { name, authoredOn, questionnaireId } = props;
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
                {authoredOn && (
                    <Typography variant="body2" color="inherit">
                        Assigned on: {format(new Date(authoredOn), 'iii, MM/dd/yyyy HH:mm:ss')}
                    </Typography>
                )}
                {questionnaireId && (
                    <Button
                        sx={{ whiteSpace: 'nowrap' }}
                        variant="text"
                        onClick={() => navigate(`${questionnaireId}/fill`)}
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
