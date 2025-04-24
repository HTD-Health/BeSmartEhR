import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Paper, Stack, Typography } from '@mui/material';
import { FC } from 'react';

interface ErrorPageProps {
    title?: string;
    message: string;
}
const ErrorPage: FC<ErrorPageProps> = ({ title = 'Error', message }) => (
    <Stack
        alignItems="center"
        justifyContent="center"
        sx={{ height: '100vh', borderTop: '60px solid', borderColor: 'primary.main' }}
    >
        <Paper elevation={5} sx={{ width: '50%', mb: 3, p: 3, textAlign: 'center' }}>
            <ErrorOutlineIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'medium' }}>
                {title}
            </Typography>
            <Typography variant="subtitle1" sx={{ color: 'text.secondary', mb: 3 }}>
                {message}
            </Typography>
        </Paper>
    </Stack>
);

export default ErrorPage;
