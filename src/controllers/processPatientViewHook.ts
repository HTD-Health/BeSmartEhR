import { NextFunction, Request, Response } from 'express';
import type { Patient } from 'fhir/r4';
import config from '../config';
import { logger } from '../middleware/request-logger';
import { generatePatientAssessment } from '../services/clinical-service';
import { CdsHooksEvent } from '../types';

export const processPatientViewHook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    logger.info(`Processing ${CdsHooksEvent.PATIENT_VIEW} hook request`);

    const hookData = req.body;
    const patient: Patient = hookData?.prefetch?.patient;

    // Validate required data
    if (!patient) {
      logger.warn('Missing patient data in prefetch');
      res.status(400).json({
        error: 'Missing required patient data',
        cards: [],
      });
    }

    // Generate clinical assessment
    const assessment = await generatePatientAssessment(patient);

    // Return CDS Hooks cards
    res.json({
      cards: [
        {
          summary: assessment.summary,
          indicator: assessment.indicator,
          detail: assessment.detail,
          source: {
            label: config.serviceName,
            url: 'https://htdhealth.com/',
            icon: config.icons.logo,
          },
          suggestions: assessment.suggestions,
          links: [
            {
              label: 'More about HTD Health',
              url: `https://htdhealth.com`,
              type: 'absolute',
            },
          ],
        },
      ],
    });
  } catch (error) {
    logger.error(`Error processing ${CdsHooksEvent.PATIENT_VIEW} hook`, error);
    next(error);
  }
};
