import { Card, Typography } from '@mui/material';
import { format } from 'date-fns';

type FilledFormItemProps = {
    name: string;
    date: string | undefined;
};

const FilledFormItem = (props: FilledFormItemProps): JSX.Element => {
    const { name, date } = props;

    return (
        <>
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
                {date && (
                    <Typography variant="body2" color="inherit">
                        Completed on: {format(new Date(date), 'iii, MM/dd/yyyy HH:mm:ss')}
                    </Typography>
                )}
            </Card>
        </>
    );
};
export default FilledFormItem;
