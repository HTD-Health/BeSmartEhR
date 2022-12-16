import { Card, Typography, Button, Checkbox, Box } from '@mui/material';
import type { Questionnaire } from 'fhir/r4';
import { useContext } from 'react';

import { FormsContext } from 'hooks/useFormsData';

type QuestionnaireItemProps = {
    questionnaire: Questionnaire;
};

const QuestionnaireItem = (props: QuestionnaireItemProps): JSX.Element => {
    const { questionnaire } = props;
    const { formsToAssign, setFormsToAssign } = useContext(FormsContext);
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        if (!questionnaire.id) {
            return;
        }

        if (event.target.checked) {
            setFormsToAssign([...formsToAssign, questionnaire.id]);
        } else {
            setFormsToAssign(formsToAssign.filter((id) => id !== questionnaire.id));
        }
    };

    const isCheckedToAssign = (): boolean => formsToAssign?.some((id) => id === questionnaire.id);

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
            <Typography variant="h6" color="inherit">
                {questionnaire?.name || 'Questionnaire name not specified'}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Checkbox checked={isCheckedToAssign()} onChange={handleChange} />
                <Button variant="contained">Assign</Button>
            </Box>
        </Card>
    );
};

export default QuestionnaireItem;
