import { Card, Typography, Button } from '@mui/material';
import type { Questionnaire } from 'fhir/r4';

type QuestionnaireItemProps = {
    questionnaire: Questionnaire;
};

const QuestionnaireItem = (props: QuestionnaireItemProps): JSX.Element => {
    const { questionnaire } = props;

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
                {questionnaire?.name}
            </Typography>
            <Button variant="contained">Assign</Button>
        </Card>
    );
};

export default QuestionnaireItem;
