import PersonIcon from '@mui/icons-material/Person';
import { Box, Card, Skeleton, Typography } from '@mui/material';
import type { Patient } from 'fhir/r4';
import { JSX } from 'react';

type PatientCardProps = {
    patient: Patient | undefined;
    isLoading: boolean;
};

type PatientDisplayData = {
    id: { label: string; value: string | undefined };
    gender: { label: string; value: string | undefined };
    birthDate: { label: string; value: string | undefined };
    address: { label: string; value: string | undefined };
    phone: { label: string; value: string | undefined };
    email: { label: string; value: string | undefined };
};

const PatientCard = (props: PatientCardProps): JSX.Element => {
    const { patient, isLoading } = props;

    const getPatientName = (): string => {
        if (!patient?.name || patient.name.length === 0) {
            return 'Patient name not provided';
        }
        const name = patient.name[0];
        if (name && name.given && name.family) {
            if (name.prefix) {
                return `${name.prefix[0]} ${name.given[0]} ${name.family}`;
            }
            return `${name.given[0]} ${name.family}`;
        }
        return 'Patient name not provided';
    };

    const getPatientDataMap = (): PatientDisplayData => ({
        id: { label: 'ID', value: patient?.id },
        gender: { label: 'Gender', value: patient?.gender },
        birthDate: { label: 'Birth Date', value: patient?.birthDate },
        address: {
            label: 'Address',
            value: patient?.address?.[0]?.line?.join(', ')
        },
        phone: {
            label: 'Phone',
            value: patient?.telecom?.find((t) => t.system === 'phone')?.value
        },
        email: {
            label: 'Email',
            value: patient?.telecom?.find((t) => t.system === 'email')?.value
        }
    });

    const renderPatientData = (): JSX.Element[] => {
        const data: PatientDisplayData = getPatientDataMap();

        return Object.keys(data).map((key: string) => {
            const el = data[key as keyof PatientDisplayData];
            return (
                <Box
                    key={key}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: '0.75rem',
                        '&:last-child': {
                            mb: 0
                        }
                    }}
                >
                    <Typography
                        component="span"
                        sx={{
                            fontWeight: 600,
                            color: 'text.secondary',
                            minWidth: '100px',
                            mr: '0.5rem'
                        }}
                    >
                        {el?.label}
                    </Typography>
                    <Typography
                        component="span"
                        sx={{
                            color: 'text.primary',
                            fontWeight: 500
                        }}
                    >
                        {el?.value || 'Not provided'}
                    </Typography>
                </Box>
            );
        });
    };

    const renderContent = (): JSX.Element => {
        if (isLoading) {
            return (
                <Box sx={{ width: '100%', p: '1.5rem' }}>
                    <Skeleton variant="text" width="60%" height={32} sx={{ mb: 2 }} />
                    <Skeleton variant="text" width="40%" height={24} sx={{ mb: 1 }} />
                    <Skeleton variant="text" width="40%" height={24} sx={{ mb: 1 }} />
                    <Skeleton variant="text" width="40%" height={24} sx={{ mb: 1 }} />
                    <Skeleton variant="text" width="40%" height={24} sx={{ mb: 1 }} />
                    <Skeleton variant="text" width="40%" height={24} sx={{ mb: 1 }} />
                    <Skeleton variant="text" width="40%" height={24} />
                </Box>
            );
        }
        return (
            <Box sx={{ p: '1.5rem' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: '1.5rem' }}>
                    <PersonIcon sx={{ mr: '0.75rem', color: 'primary.main', fontSize: '2rem' }} />
                    <Typography
                        variant="h5"
                        color="text.primary"
                        noWrap
                        sx={{
                            fontWeight: 600,
                            letterSpacing: '-0.02em'
                        }}
                    >
                        {getPatientName()}
                    </Typography>
                </Box>
                {renderPatientData()}
            </Box>
        );
    };

    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                    transform: 'translateY(-2px)'
                }
            }}
        >
            {renderContent()}
        </Card>
    );
};

export default PatientCard;
