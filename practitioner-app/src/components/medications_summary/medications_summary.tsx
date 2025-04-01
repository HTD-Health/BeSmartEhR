import { Box, Card, CircularProgress, Typography } from '@mui/material';
import MedicationIcon from '@mui/icons-material/Medication';
import { format } from 'date-fns';
import type { MedicationRequest, OperationOutcome } from 'fhir/r4';

import { useGetMedications } from 'api/queries';

const MedicationsSummary = (): JSX.Element => {
    const { data, isLoading } = useGetMedications();

    const isOperationOutcome = (entry: any): entry is { resource: OperationOutcome } => 
        entry?.resource?.resourceType === 'OperationOutcome';

    const isMedicationRequest = (entry: any): entry is { resource: MedicationRequest } => 
        entry?.resource?.resourceType === 'MedicationRequest';

    const renderMedication = (medication: MedicationRequest): JSX.Element => {
        const authoredDate = medication.authoredOn 
            ? format(new Date(medication.authoredOn), 'MMM d, yyyy')
            : 'Date not recorded';

        return (
            <Box 
                key={medication.id}
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
                <MedicationIcon sx={{ color: 'primary.main' }} />
                <Box>
                    <Typography 
                        variant="body1"
                        sx={{ 
                            fontWeight: 500,
                            color: 'text.primary'
                        }}
                    >
                        {medication.medicationCodeableConcept?.text || 'Unnamed medication'}
                    </Typography>
                    <Typography 
                        variant="body2"
                        sx={{ 
                            color: 'text.secondary',
                            fontSize: '0.875rem'
                        }}
                    >
                        {authoredDate} • {medication.status}
                    </Typography>
                </Box>
            </Box>
        );
    };

    const renderContent = (): JSX.Element => {
        if (isLoading) {
            return <CircularProgress size={24} />;
        }

        // Check if we received an OperationOutcome
        if (data?.entry?.length === 1 && isOperationOutcome(data.entry[0])) {
            return (
                <Typography variant="body1" color="text.secondary">
                    No medications found
                </Typography>
            );
        }

        // Check if we have any valid medication entries
        const medicationEntries = data?.entry?.filter(isMedicationRequest) || [];
        if (medicationEntries.length === 0) {
            return (
                <Typography variant="body1" color="text.secondary">
                    No medications recorded
                </Typography>
            );
        }

        return (
            <>
                {medicationEntries.map((entry) => renderMedication(entry.resource))}
            </>
        );
    };

    return (
        <Card
            sx={{
                p: '1.5rem',
                height: '100%',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)',
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
                Recent Medications
            </Typography>
            {renderContent()}
        </Card>
    );
};

export default MedicationsSummary; 