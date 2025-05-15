import WarningIcon from '@mui/icons-material/Warning';
import { Box, Card, CircularProgress, Typography } from '@mui/material';
import type { AllergyIntolerance, BundleEntry } from 'fhir/r4';

import { useGetAllergies } from '@/api/queries';
import { format } from 'date-fns';
import { JSX } from 'react';

const AllergiesSummary = (): JSX.Element => {
    const { data, isLoading } = useGetAllergies();

    const renderAllergy = (allergy: AllergyIntolerance): JSX.Element => {
        const recordedDate = allergy.recordedDate
            ? format(new Date(allergy.recordedDate), 'MMM d, yyyy')
            : 'Date not recorded';

        const criticality = allergy.criticality
            ? allergy.criticality.charAt(0).toUpperCase() + allergy.criticality.slice(1).toLowerCase()
            : 'Unknown';

        return (
            <Box
                key={allergy.id}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    mb: '0.75rem',
                    '&:last-child': {
                        mb: 0
                    }
                }}
            >
                <WarningIcon sx={{ color: 'warning.main' }} />
                <Box>
                    <Typography
                        variant="body1"
                        sx={{
                            fontWeight: 500,
                            color: 'text.primary'
                        }}
                    >
                        {allergy.code?.text || 'Unnamed allergy'}
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            color: 'text.secondary',
                            fontSize: '0.875rem'
                        }}
                    >
                        {recordedDate} • {criticality} criticality
                    </Typography>
                </Box>
            </Box>
        );
    };

    const renderContent = (): JSX.Element => {
        if (isLoading) {
            return <CircularProgress size={24} />;
        }

        if (!data?.entry || data.entry.length === 0) {
            return (
                <Typography variant="body1" color="text.secondary">
                    No allergies recorded
                </Typography>
            );
        }

        return <>{data.entry.map((entry: BundleEntry) => renderAllergy(entry.resource as AllergyIntolerance))}</>;
    };

    return (
        <Card
            sx={{
                p: '1.5rem',
                height: '100%',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)'
                }
            }}
        >
            <Typography
                variant="h6"
                sx={{
                    mb: '1rem',
                    fontWeight: 600,
                    color: 'text.primary'
                }}
            >
                Allergies & Intolerances
            </Typography>
            {renderContent()}
        </Card>
    );
};

export default AllergiesSummary;
