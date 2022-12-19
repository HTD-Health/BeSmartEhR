import PersonIcon from '@mui/icons-material/Person';
import AppBar from '@mui/material/AppBar';
import { Box, IconButton } from '@mui/material';
import Typography from '@mui/material/Typography';
import type { Practitioner } from 'fhir/r4';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';

import { useGetUser } from 'api/queries';
import CustomSnackbar from 'components/custom_snackbar/custom_snackbar';

const SmartAppBar = (): JSX.Element => {
    const [errorSnackbar, setErrorSnackbar] = useState(false);
    const { error, data } = useGetUser();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (error) {
            setErrorSnackbar(true);
            console.error(error);
        }
    }, [error]);

    const getUserName = (user: Practitioner): string => {
        if (!user.name || user.name.length === 0) {
            return '';
        }
        const name = user.name[0];
        if (name && name.given && name.family) {
            if (name.prefix) {
                return `${name.prefix[0]} ${name.given[0]} ${name.family}`;
            }
            return `${name.given[0]} ${name.family}`;
        }
        return '';
    };

    const renderUserData = (): JSX.Element => {
        if (!data) {
            return <Box />;
        }
        return (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PersonIcon sx={{ mr: '0.5rem' }} />
                <Typography variant="body1" color="inherit" noWrap>
                    {getUserName(data)}
                </Typography>
            </Box>
        );
    };

    return (
        <AppBar position="relative">
            <CustomSnackbar
                open={errorSnackbar}
                onClose={() => setErrorSnackbar(false)}
                message="Failed to get current user data"
            />
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    py: '3rem',
                    px: '2rem'
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {!location.pathname.includes('/patient-profile') && (
                        <IconButton
                            onClick={() => navigate(-1)}
                            sx={{ minHeight: 0, minWidth: 0, padding: 0, mr: '.5rem' }}
                        >
                            <ArrowCircleLeftIcon fontSize="large" />
                        </IconButton>
                    )}
                    <Typography variant="h5" color="inherit" noWrap>
                        BeSmartEhR - Practitioner App
                    </Typography>
                </Box>
                {renderUserData()}
            </Box>
        </AppBar>
    );
};

export default SmartAppBar;
