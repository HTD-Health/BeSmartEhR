import { Box, Card, Typography } from '@mui/material';
import type { Patient } from 'fhir/r4';

type PatientCardProps = {
    patient: Patient | null;
};

type PatientDisplayData = {
    [key in keyof (Partial<Patient> & { addressCity?: string; addressState?: string; addressStreet?: string })]: {
        label: string;
        value?: string;
    };
};

const PatientCard = (props: PatientCardProps): JSX.Element => {
    const { patient } = props;

    const getPatientName = (): string | undefined => {
        if (!patient || !patient.name || patient.name.length === 0) {
            return '';
        }
        const name = patient.name[0];
        if (!name.given || name.given.length === 0) {
            return name.family;
        }
        return `${name.given[0]} ${name.family}`;
    };

    const getPatientDataMap = (): PatientDisplayData => {
        const data: PatientDisplayData = {};
        if (!patient) {
            return data;
        }
        if (patient.birthDate) {
            data.birthDate = {
                label: 'Birth Date',
                value: patient.birthDate
            };
        }
        if (patient.gender) {
            data.gender = {
                label: 'Gender',
                value: patient.gender
            };
        }
        if (patient.maritalStatus) {
            data.maritalStatus = {
                label: 'Marital Status',
                value: patient.maritalStatus.text
            };
        }
        if (patient.telecom) {
            data.telecom = {
                label: 'Contact',
                value: patient.telecom[0].value
            };
        }
        if (patient.address) {
            data.addressCity = {
                label: 'City',
                value: patient.address[0].city
            };
            data.addressState = {
                label: 'State',
                value: patient.address[0].state
            };
            if (patient.address[0].line) {
                data.addressStreet = {
                    label: 'Street',
                    value: patient.address[0].line[0]
                };
            }
        }
        return data;
    };

    const renderPatientData = (): JSX.Element[] => {
        const data: PatientDisplayData = getPatientDataMap();

        return Object.keys(data).map((key: string) => {
            const el = data[key as keyof PatientDisplayData];
            return (
                <div key={key}>
                    <Box component="span" sx={{ fontWeight: 'bold' }}>
                        {el?.label}
                    </Box>
                    : {el?.value}
                </div>
            );
        });
    };

    return (
        <>
            <Card sx={{ p: '1rem' }}>
                <Typography sx={{ mb: '0.5rem' }} variant="h5" color="inherit" noWrap>
                    {getPatientName()}
                </Typography>
                <Typography variant="body1" color="inherit" noWrap>
                    {renderPatientData()}
                </Typography>
            </Card>
        </>
    );
};

export default PatientCard;
