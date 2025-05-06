import type { Patient } from 'fhir/r4';
import { generateAssessmentHtml } from '../components/assessmentTemplate';
import { logger } from '../middleware/logger';
import { getAgeGroupInfo } from '../styles/ageGroupStyles';
import { CardIndicator } from '../types';
import { calculateAge } from '../utils/ageCalculator';
import { getPatientFullName } from '../utils/patientFormatter';

export interface AssessmentResult {
  summary: string;
  indicator: CardIndicator;
  detail: string;
  suggestions: Array<{
    label: string;
    uuid?: string;
  }>;
}

export async function generatePatientAssessment(
  patient: Patient
): Promise<AssessmentResult> {
  logger.info(`Generating assessment for patient ${patient.id}`);

  const fullName = getPatientFullName(patient);
  const patientAge = calculateAge(patient.birthDate);
  const ageGroup = getAgeGroupInfo(patientAge);

  const detailHtml = generateAssessmentHtml(fullName, patientAge, ageGroup);

  return {
    summary: `Health Assessment`,
    indicator: ageGroup.indicator,
    detail: detailHtml,
    suggestions: [
      {
        label: 'Schedule Routine Follow-up',
      },
    ],
  };
}
