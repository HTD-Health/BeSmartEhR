import { Box, Card, Typography } from '@mui/material';
import { format } from 'date-fns';

type FiledFormItemProps = {
    name: string;
    date: string | undefined;
};

const FiledFormItem = (props: FiledFormItemProps): JSX.Element => {
    const { name, date } = props;

    return (
        <>
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
                        {name}
                    </Typography>
                    {date && (
                        <Typography variant="body2" color="inherit">
                            Assigned on: {format(new Date(date), 'iii, MM/dd/yyyy HH:mm:ss')}
                        </Typography>
                    )}
                </Box>
            </Card>
        </>
    );
};
export default FiledFormItem;
