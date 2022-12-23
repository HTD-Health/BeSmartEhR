import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { Box, Button, Card, Typography } from '@mui/material';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

type FilledFormItemProps = {
    name: string;
    date?: string;
    responseId?: string;
};

const FilledFormItem = (props: FilledFormItemProps): JSX.Element => {
    const { name, date, responseId } = props;
    const navigate = useNavigate();

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
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {date && (
                        <Typography variant="body2" color="inherit">
                            Completed on: {format(new Date(date), 'iii, MM/dd/yyyy HH:mm:ss')}
                        </Typography>
                    )}
                    {responseId && (
                        <Button
                            sx={{ whiteSpace: 'nowrap' }}
                            variant="text"
                            onClick={() => navigate(`${responseId}/view`)}
                            endIcon={<ArrowRightAltIcon />}
                        >
                            Show
                        </Button>
                    )}
                </Box>
            </Card>
        </>
    );
};
export default FilledFormItem;
