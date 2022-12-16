import { Card, Typography } from '@mui/material';
import { format } from 'date-fns';

type AssignedQuestionnaireItemProps = {
    name: string;
    authoredOn: string | undefined;
};

const AssignedQuestionnaireItem = (props: AssignedQuestionnaireItemProps): JSX.Element => {
    const { name, authoredOn } = props;

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
        </Card>
    );
};

export default AssignedQuestionnaireItem;
