import { Request, Response } from 'express';
import { logger } from '../middleware/request-logger';
import { CdsHooksEvent, Services } from '../types';

export const getCdsServices = (_req: Request, res: Response) => {
  logger.info('CDS services discovery endpoint called');

  res.json({
    services: [
      {
        hook: CdsHooksEvent.PATIENT_VIEW,
        name: 'HTD Health Patient Assessment',
        description:
          'Provides routine check recommendation based on patient data',
        id: Services.PATIENT_ASSESSMENT,
        prefetch: {
          patient: 'Patient/{{context.patientId}}',
        },
      },
    ],
  });
};
