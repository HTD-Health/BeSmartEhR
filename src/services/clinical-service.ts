import type { Patient } from 'fhir/r4';
import { logger } from '../middleware/logger';

export interface AssessmentResult {
  summary: string;
  indicator: 'info' | 'warning' | 'critical' | 'success';
  detail: string;
  suggestions: Array<{
    label: string;
    uuid?: string;
    actions?: Array<any>;
  }>;
}

export async function generatePatientAssessment(
  patient: Patient
): Promise<AssessmentResult> {
  logger.info(`Generating assessment for patient ${patient.id}`);

  // Get patient name
  const patientName = patient.name?.[0];
  const fullName = patientName
    ? `${patientName.given?.[0] || ''} ${patientName.family || ''}`.trim()
    : 'Patient';

  return {
    summary: 'Routine Health Assessment',
    indicator: 'info',
    detail: `${fullName}'s health profile has been reviewed by HTD Health.`,
    suggestions: [
      {
        label: 'Schedule Routine Follow-up',
        actions: [],
      },
    ],
  };
}
