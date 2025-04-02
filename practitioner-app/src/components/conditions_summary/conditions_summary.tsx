import { Box, Card, CircularProgress, Typography } from '@mui/material';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import { format } from 'date-fns';
import type { Condition, OperationOutcome } from 'fhir/r4';

import { useGetConditions } from 'api/queries';

const ConditionsSummary = (): JSX.Element => {
    const { data, isLoading } = useGetConditions();

    const isOperationOutcome = (entry: any): entry is { resource: OperationOutcome } => 
        entry?.resource?.resourceType === 'OperationOutcome';

    const isCondition = (entry: any): entry is { resource: Condition } => 
        entry?.resource?.resourceType === 'Condition';

    const renderCondition = (condition: Condition): JSX.Element => {
        const recordedDate = condition.recordedDate 
            ? format(new Date(condition.recordedDate), 'MMM d, yyyy')
            : 'Date not recorded';

        const category = condition.category?.[0]?.text || 'Uncategorized';
        const notes = condition.note?.[0]?.text;

        return (
            <Box 
                key={condition.id}
                sx={{ 
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.5rem',
                    mb: '1rem',
                    '&:last-child': {
                        mb: 0
                    }
                }}
            >
                <MonitorHeartIcon sx={{ color: 'error.main', mt: '2px' }} />
                <Box>
                    <Typography 
                        variant="body1"
                        sx={{ 
                            fontWeight: 500,
                            color: 'text.primary',
                            mb: '0.25rem'
                        }}
                    >
                        {condition.code?.text || 'Unnamed condition'}
                    </Typography>
                    <Typography 
                        variant="body2"
                        sx={{ 
                            color: 'text.secondary',
                            fontSize: '0.875rem',
                            mb: notes ? '0.25rem' : 0
                        }}
                    >
                        {recordedDate} • {category}
                    </Typography>
                    {notes && (
                        <Typography
                            variant="body2"
                            sx={{
                                color: 'text.secondary',
                                fontSize: '0.875rem',
                                fontStyle: 'italic'
                            }}
                        >
                            Note: {notes}
                        </Typography>
                    )}
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
                    No conditions found
                </Typography>
            );
        }

        // Check if we have any valid condition entries
        const conditionEntries = data?.entry?.filter(isCondition) || [];
        if (conditionEntries.length === 0) {
            return (
                <Typography variant="body1" color="text.secondary">
                    No conditions recorded
                </Typography>
            );
        }

        return (
            <>
                {conditionEntries.map((entry) => renderCondition(entry.resource))}
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
                Conditions
            </Typography>
            {renderContent()}
        </Card>
    );
};

export default ConditionsSummary; 