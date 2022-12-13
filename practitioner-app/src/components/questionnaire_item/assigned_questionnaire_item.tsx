import { Card, Typography } from '@mui/material';
import type { Questionnaire } from 'fhir/r4';
import { format } from 'date-fns';

type AssignedQuestionnaireItemProps = {
    questionnaire: Questionnaire;
    authoredOn: string | undefined;
};

const AssignedQuestionnaireItem = (props: AssignedQuestionnaireItemProps): JSX.Element => {
    const { questionnaire, authoredOn } = props;

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
                {questionnaire?.name || 'Questionnaire name not specified'}
            </Typography>
            {authoredOn && (
                <Typography variant="body2" color="inherit">
                    Assigned on: {format(new Date(authoredOn), 'iii, MM/dd/yyyy HH:mm:ss')}
                </Typography>
            )}
        </Card>
    );
};

export default AssignedQuestionnaireItem;
