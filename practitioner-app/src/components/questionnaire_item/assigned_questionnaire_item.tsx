import { Button, Card, Typography } from '@mui/material';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

type AssignedQuestionnaireItemProps = {
    name: string;
    authoredOn?: string;
    questionnaireId?: string;
};

const AssignedQuestionnaireItem = (props: AssignedQuestionnaireItemProps): JSX.Element => {
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
            {authoredOn && (
                <Typography variant="body2" color="inherit">
                    Assigned on: {format(new Date(authoredOn), 'iii, MM/dd/yyyy HH:mm:ss')}
                </Typography>
            )}
            {questionnaireId && <Button onClick={() => navigate(`${questionnaireId}/fill`)}>Fill</Button>}
        </Card>
    );
};

export default AssignedQuestionnaireItem;
