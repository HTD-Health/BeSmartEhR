import type { Condition, Patient, Resource, ServiceRequest } from 'fhir/r4';
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
    isRecommended?: boolean;
    actions: Array<{
      type: string;
      description: string;
      resource: ServiceRequest | Condition | Resource;
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
        label: 'Create Problem List Condition', //required
        uuid: '8c0193ab-f511-4dd7-8400-fd45a087c719', //Should be implemented as guid
        isRecommended: false, //Determines if automatically selected as follow-up or if user has to manually select problem list suggestion
        actions: [
          {
            type: 'create', //always "create"
            description: 'Create Problem List Dx', //Used as display next to "Add Problem"/"Do Not Add" next to description of diagnosis obtained from code mapping
            resource: {
              resourceType: 'Condition', //Required
              code: {
                text: 'Other primary thrombophilia', //unused
                coding: [
                  {
                    code: 'D68.59', //coding is mapped to diagnosis data in Epic
                    system: 'urn:oid:2.16.840.1.113883.6.90',
                  },
                ],
              },
              category: [
                {
                  //Required element
                  text: 'Problem List Item',
                  coding: [
                    {
                      code: 'problem-list-item',
                      system:
                        'http://terminology.hl7.org/CodeSystem/condition-category',
                    },
                  ],
                },
              ],
              subject: {
                reference: 'Patient/' + patient.id, //Patient FHIR ID required
              },
            },
          },
        ],
      },
    ],
  };
}
