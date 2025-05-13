import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import DescriptionIcon from '@mui/icons-material/Description';
import { Box, Button, Card, Tooltip, Typography } from '@mui/material';
import { format } from 'date-fns';
import { JSX } from 'react';
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
        <Card
            sx={{
                m: '.5rem',
                p: '1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)'
                }
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <DescriptionIcon sx={{ color: 'primary.main' }} />
                <Box>
                    <Typography
                        variant="h6"
                        color="text.primary"
                        sx={{
                            fontWeight: 500,
                            letterSpacing: '-0.01em'
                        }}
                    >
                        {name}
                    </Typography>
                    {date && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: '0.25rem' }}>
                            Completed on: {format(new Date(date), 'iii, MM/dd/yyyy HH:mm:ss')}
                        </Typography>
                    )}
                </Box>
            </Box>
            {responseId && (
                <Tooltip title="View response">
                    <Button
                        variant="outlined"
                        onClick={() => navigate(`${responseId}/view`)}
                        endIcon={<ArrowRightAltIcon />}
                        sx={{
                            textTransform: 'none',
                            fontWeight: 500,
                            borderColor: 'primary.main',
                            color: 'primary.main',
                            '&:hover': {
                                borderColor: 'primary.dark',
                                backgroundColor: 'primary.main',
                                color: 'white'
                            }
                        }}
                    >
                        View
                    </Button>
                </Tooltip>
            )}
        </Card>
    );
};

export default FilledFormItem;
