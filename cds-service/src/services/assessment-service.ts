import type { Patient, Resource, ServiceRequest } from 'fhir/r4';
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
      resource: ServiceRequest | Resource;
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
      // {
      //   label: 'Arthritis',
      //   uuid: 'cf72fe83-1eb9-410c-94aa-04ec98736388',
      //   actions: [
      //     {
      //       type: 'create',
      //       description: 'Arthritis',
      //       resource: {
      //         resourceType: 'Condition',
      //         category: [
      //           {
      //             coding: [
      //               {
      //                 system:
      //                   'http://terminology.hl7.org/CodeSystem/condition-category',
      //                 code: 'encounter-diagnosis',
      //                 display: 'Encounter diagnosis',
      //               },
      //             ],
      //             text: 'Encounter diagnosis',
      //           },
      //         ],
      //         code: {
      //           coding: [
      //             {
      //               system: 'urn:com.epic.cdshooks.action.code.system.cms-hcc',
      //               code: '40',
      //               display: 'Arthritis',
      //             },
      //           ],
      //           text: 'Stomach ache',
      //         },
      //       },
      //     },
      //   ],
      // },
      {
        label: 'CBC',
        uuid: '613b0192-4243-4384-8294-4316dfb726bb',
        actions: [
          {
            type: 'create',
            description: 'CBC from CDS Hooks',
            resource: {
              resourceType: 'ServiceRequest',
              status: 'draft',
              intent: 'proposal',
              category: [
                {
                  coding: [
                    {
                      system:
                        'http://terminology.hl7.org/CodeSystem/medicationrequest-category',
                      code: 'outpatient',
                      display: 'Outpatient',
                    },
                  ],
                },
              ],
              code: {
                coding: [
                  {
                    system:
                      'urn:com.epic.cdshooks.action.code.system.preference-list-item',
                    code: 'CBC_IP',
                  },
                ],
                text: 'Test Proc Display name',
              },
            },
          },
        ],
      },
    ],
  };
}
