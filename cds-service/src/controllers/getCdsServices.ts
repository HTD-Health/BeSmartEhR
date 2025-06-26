import { Request, Response } from 'express';
import { CDSHooksEvent, Services } from '../types';

export const getCdsServices = (_req: Request, res: Response) => {
  res.json({
    services: [
      {
        hook: CDSHooksEvent.PATIENT_VIEW,
        name: 'HTD Health Patient Assessment',
        description:
          'Provides routine check recommendation based on patient data',
        id: Services.PATIENT_ASSESSMENT,
        prefetch: {
          patient: 'Patient/{{context.patientId}}',
        },
      },
      {
        hook: CDSHooksEvent.ORDER_SELECT,
        name: 'HTD Health Order Assistant',
        description: 'Informs about medication when selecting orders',
        id: Services.ORDER_ASSISTANT,
      },
      {
        hook: CDSHooksEvent.ORDER_SIGN,
        name: 'HTD Health Order Review',
        description: 'Reviews medication when selecting orders',
        id: Services.ORDER_REVIEW,
      },
    ],
  });
};
