import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import PersonIcon from '@mui/icons-material/Person';
import { Box, IconButton, Tooltip } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import type { Practitioner } from 'fhir/r4';
import { JSX, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useGetUser } from '@/api/queries';
import CustomSnackbar from '@/components/custom_snackbar/custom_snackbar';

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

    const getUserName = (user?: Practitioner): string => {
        if (!user?.name || user.name.length === 0) {
            return 'Unknown User';
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
        return (
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.2)'
                    }
                }}
            >
                <PersonIcon sx={{ mr: '0.75rem', color: 'white' }} />
                <Typography variant="body1" color="white" noWrap>
                    {getUserName(data)}
                </Typography>
            </Box>
        );
    };

    return (
        <AppBar
            position="relative"
            elevation={0}
            sx={{
                borderBottom: '1px solid',
                borderColor: 'grey.200',
                bgcolor: 'primary.main',
                color: 'white'
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    py: '0.75rem',
                    px: 0,
                    paddingX: 4,
                    width: '100%',
                    position: 'relative'
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {!location.pathname.includes('/patient-profile') && (
                        <Tooltip title="Go back">
                            <IconButton
                                onClick={() => navigate(-1)}
                                sx={{
                                    color: 'white',
                                    transition: 'all 0.2s ease-in-out',
                                    mr: '1rem',
                                    '&:hover': {
                                        transform: 'translateX(-2px)',
                                        color: 'grey.100'
                                    }
                                }}
                            >
                                <ArrowCircleLeftIcon fontSize="large" />
                            </IconButton>
                        </Tooltip>
                    )}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 700,
                                letterSpacing: '0.02em',
                                color: 'white',
                                lineHeight: 1
                            }}
                        >
                            HTD
                        </Typography>
                        <Box
                            sx={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                bgcolor: '#00F0FF',
                                ml: '2px',
                                mt: '-12px'
                            }}
                        />
                    </Box>
                </Box>
                <Box>{renderUserData()}</Box>
            </Box>
            <CustomSnackbar
                open={errorSnackbar}
                onClose={() => setErrorSnackbar(false)}
                message="Failed to get current user data"
            />
        </AppBar>
    );
};

export default SmartAppBar;
