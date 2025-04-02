import { LoadingButton } from '@mui/lab';
import { Box, Card, Checkbox, Typography, Tooltip } from '@mui/material';
import type { Questionnaire } from 'fhir/r4';
import { useContext, useEffect, useState } from 'react';
import AssignmentIcon from '@mui/icons-material/Assignment';

import { useAssignForms } from 'api/mutations';
import CustomSnackbar from 'components/custom_snackbar/custom_snackbar';
import { FormsContext } from 'hooks/useFormsData';

type FormItemProps = {
    questionnaire: Questionnaire;
};

const FormItem = (props: FormItemProps): JSX.Element => {
    const { questionnaire } = props;
    const { formsToAssign, setFormsToAssign } = useContext(FormsContext);
    const [errorSnackbar, setErrorSnackbar] = useState(false);
    const [successSnackbar, setSuccessSnackbar] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { mutate: assign } = useAssignForms();

    useEffect(() => {
        if (errorSnackbar) {
            const timer = setTimeout(() => {
                setErrorSnackbar(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
        return undefined;
    }, [errorSnackbar]);

    useEffect(() => {
        if (successSnackbar) {
            const timer = setTimeout(() => {
                setSuccessSnackbar(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
        return undefined;
    }, [successSnackbar]);

    const isCheckedToAssign = (): boolean => formsToAssign.some((form) => form.id === questionnaire.id);

    const handleChange = (): void => {
        if (!questionnaire.id) return;
        
        if (isCheckedToAssign()) {
            setFormsToAssign(formsToAssign.filter((form) => form.id !== questionnaire.id));
        } else {
            setFormsToAssign([...formsToAssign, { id: questionnaire.id, name: questionnaire.title ?? 'Form name not provided' }]);
        }
    };

    const handleAssign = async (): Promise<void> => {
        if (!questionnaire.id) return;
        
        setIsLoading(true);
        try {
            await assign([{ id: questionnaire.id, name: questionnaire.title ?? 'Form name not provided' }]);
            setSuccessSnackbar(true);
        } catch (error) {
            setErrorSnackbar(true);
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

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
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)',
                }
            }}
        >
            <CustomSnackbar
                key={`error${questionnaire.id}`}
                open={errorSnackbar}
                onClose={() => setErrorSnackbar(false)}
                message="Failed to assign form"
            />
            <CustomSnackbar
                key={`success${questionnaire.id}`}
                open={successSnackbar}
                severity="success"
                onClose={() => setSuccessSnackbar(false)}
                message="Form assigned successfully"
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <AssignmentIcon sx={{ color: 'primary.main' }} />
                <Typography 
                    variant="h6" 
                    color="text.primary"
                    sx={{
                        fontWeight: 500,
                        letterSpacing: '-0.01em',
                    }}
                >
                    {questionnaire?.title || 'Form name not provided'}
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Tooltip title={isCheckedToAssign() ? "Remove from batch" : "Add to batch"}>
                    <Checkbox 
                        checked={isCheckedToAssign()} 
                        onChange={handleChange}
                        sx={{
                            color: 'primary.main',
                            '&.Mui-checked': {
                                color: 'primary.main',
                            },
                        }}
                    />
                </Tooltip>
                <LoadingButton 
                    loading={isLoading} 
                    variant="contained" 
                    onClick={handleAssign}
                    startIcon={<AssignmentIcon />}
                    sx={{
                        textTransform: 'none',
                        fontWeight: 500,
                    }}
                >
                    Assign
                </LoadingButton>
            </Box>
        </Card>
    );
};

export default FormItem;
