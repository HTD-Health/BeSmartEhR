import { NextFunction, Request, Response } from 'express';
import type { Patient } from 'fhir/r4';
import config from '../config';
import { logger } from '../middleware/logger';
import { generatePatientAssessment } from '../services/assessment-service';
import { CDSHooksEvent } from '../types';
import { SERVERS_SUPPORTING_HTML } from '../utils/serversSupportingHTML';

export const processPatientViewHook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const hookData = req.body;
    const patient: Patient = hookData?.prefetch?.patient;

    // Validate required data
    if (!patient) {
      logger.warn('Missing patient data in prefetch');
      res.status(400).json({
        error: 'Missing required patient data',
        cards: [],
      });
      return;
    }

    const isSupportHTML = SERVERS_SUPPORTING_HTML.includes(
      hookData.fhirServer as string
    );

    // Generate clinical assessment
    const assessment = await generatePatientAssessment(patient, isSupportHTML);

    const smartAppLink = (hookData.fhirServer as string)
      .toLowerCase()
      .includes('epic')
      ? {
          label: config.smartApp.name,
          url: config.smartApp.url,
          type: 'smart',
        }
      : {
          label: config.smartApp.name,
          url: `${config.smartApp.url}?context=${encodeURIComponent(JSON.stringify(hookData))}`,
          type: 'absolute',
        };

    // Return CDS Hooks cards
    res.json({
      cards: [
        {
          summary: assessment.summary,
          indicator: assessment.indicator,
          extension: {
            'com.epic.cdshooks.card.detail.content-type': 'text/html',
          },
          detail: assessment.detail,
          source: {
            label: config.serviceName,
            url: 'https://cds-service.htdhealth.com/',
            icon: config.icons.logo,
          },
          suggestions: assessment.suggestions,
          links: [smartAppLink],
        },
      ],
    });
  } catch (error) {
    logger.error(`Error processing ${CDSHooksEvent.PATIENT_VIEW} hook`, error);
    next(error);
  }
};
