import type { MedicationRequest, Patient, Resource } from 'fhir/r4';
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
    actions: Array<{
      type: string;
      description: string;
      resource: MedicationRequest | Resource;
    }>;
  }>;
}

export async function generatePatientAssessment(
  patient: Patient,
  supportHTML: boolean = false
): Promise<AssessmentResult> {
  logger.info(`Generating assessment for patient ${patient.id}`);

  const fullName = getPatientFullName(patient);
  const patientAge = calculateAge(patient.birthDate);
  const ageGroup = getAgeGroupInfo(patientAge);

  const detailHtml = generateAssessmentHtml(fullName, patientAge, ageGroup);
  const detailText = `${fullName}'s health profile has been reviewed by HTD Health.\n\nAge Group: ${ageGroup.name}\n\nAge: ${patientAge}`;

  return {
    summary: `Health Assessment`,
    indicator: ageGroup.indicator,
    detail: supportHTML ? detailHtml : detailText,
    suggestions: [
      {
        label: 'Schedule Routine Follow-up',
        uuid: '9eee42c7-2d2c-490a-bf9b-8c79815bccc2',
        actions: [
          {
            type: 'create',
            description:
              'Create a resource with the newly suggested medication',
            resource: {
              resourceType: 'MedicationRequest',
              id: 'request-123',
              status: 'draft',
              subject: {
                reference: 'Patient/ae8a896e-bbd9-4e1a-a732-1568df9d7527',
              },
              authoredOn: '2025-07-01',
              dosageInstruction: [
                {
                  timing: {
                    repeat: {
                      frequency: 1,
                      period: 1,
                      periodUnit: 'd',
                    },
                  },
                  doseAndRate: [
                    {
                      doseQuantity: {
                        value: 1,
                        system: 'http://unitsofmeasure.org',
                        code: '{pill}',
                      },
                    },
                  ],
                },
              ],
              dispenseRequest: {
                expectedSupplyDuration: {
                  value: 1,
                  unit: 'days',
                  system: 'http://unitsofmeasure.org',
                  code: 'd',
                },
              },
              intent: 'order',
              category: [
                {
                  coding: [
                    {
                      system:
                        'http://terminology.hl7.org/CodeSystem/medicationrequest-category',
                      code: 'community',
                    },
                  ],
                },
              ],
              medicationCodeableConcept: {
                text: 'Ibuprofen 200 MG Oral Tablet',
                coding: [
                  {
                    code: '310965',
                    system: 'http://www.nlm.nih.gov/research/umls/rxnorm',
                    display: 'Ibuprofen 200 MG Oral Tablet',
                  },
                ],
              },
            },
          },
        ],
      },
    ],
  };
}
