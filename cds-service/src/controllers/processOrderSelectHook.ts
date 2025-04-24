import { NextFunction, Request, Response } from 'express';
import { Bundle, CodeableConcept } from 'fhir/r4';
import config from '../config';
import { logger } from '../middleware/logger';
import { CdsHooksEvent } from '../types';

export const processOrderSelectHook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.info(`Processing ${CdsHooksEvent.ORDER_SELECT} hook request`);

  try {
    const hookData = req.body;
    const draftOrders: Bundle = hookData?.context?.draftOrders;

    const medicationResource = draftOrders?.entry?.find((resource) =>
      (resource.resource?.resourceType as string).startsWith('Medication')
    )?.resource as unknown as Record<string, unknown>;

    if (!medicationResource) {
      logger.warn('Missing medication resource');
      res.status(400).json({
        error: 'Missing medication resource data',
        cards: [],
      });
      return;
    }

    const medication =
      medicationResource?.medicationCodeableConcept as CodeableConcept;

    if (!medication) {
      logger.warn('Missing medication data');
      res.status(400).json({
        error: 'Missing medication data',
        cards: [],
      });
      return;
    }

    res.json({
      cards: [
        {
          summary: 'Order Selection Review',
          indicator: 'info',
          detail: `HTD Health has reviewed order of ${medication.coding?.[0].display}.`,
          source: {
            label: config.serviceName,
            url: 'https://cds-service.htdhealth.com/',
            icon: config.icons.logo,
          },
          links: [
            {
              label: 'View RxNorm Medication Information',
              url: `https://mor.nlm.nih.gov/RxNav/search?searchBy=RXCUI&searchTerm=${medication.coding?.[0].code}`,
              type: 'absolute',
            },
          ],
        },
      ],
    });
  } catch (error) {
    logger.error(`Error processing ${CdsHooksEvent.ORDER_SELECT} hook`, error);
    next(error);
  }
};
