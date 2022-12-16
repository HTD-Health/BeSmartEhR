import { Box, Card, Typography } from '@mui/material';
import type { Questionnaire } from 'fhir/r4';

type QuestionnaireResourceItemProps = {
    questionnaire: Questionnaire;
};

const QuestionnaireResourceItem = (props: QuestionnaireResourceItemProps): JSX.Element => {
    const { questionnaire } = props;

    const dateString = questionnaire?.date
        ? new Date(questionnaire.date as string).toDateString()
        : 'Questionnaire assignment date not specified';

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
            <Box>
                <Typography variant="h6" color="inherit">
                    {questionnaire?.title || 'Questionnaire name not specified'}
                </Typography>
                <Typography variant="h6" color="inherit">
                    Assignment date: {dateString}
                </Typography>
                <Typography variant="h6" color="inherit">
                    {questionnaire?.publisher || 'Questionnaire publisher not specified'}
                </Typography>
            </Box>
        </Card>
    );
};

export default QuestionnaireResourceItem;
