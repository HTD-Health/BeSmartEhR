import type { Patient } from 'fhir/r4';

export const getPatientFullName = (patient: Patient): string => {
  const patientName = patient.name?.[0];
  return patientName
    ? `${patientName.given?.[0] || ''} ${patientName.family || ''}`.trim()
    : 'Patient';
};
