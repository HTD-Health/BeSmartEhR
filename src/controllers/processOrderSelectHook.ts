import { NextFunction, Request, Response } from 'express';
import { MedicationOrder } from 'fhir/r2';
import { Bundle } from 'fhir/r4';
import config from '../config';
import { logger } from '../middleware/request-logger';
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

    const medicationOrder = draftOrders?.entry?.find(
      (resource) =>
        (resource.resource?.resourceType as string) === 'MedicationOrder'
    )?.resource as unknown as MedicationOrder;

    if (!medicationOrder) {
      logger.warn('Missing medication order');
      res.status(400).json({
        error: 'Missing medication order data',
        cards: [],
      });
      return;
    }

    const medication = medicationOrder.medicationCodeableConcept;

    logger.info('Medication order found:', medicationOrder);
    logger.info('Medication found:', medication);

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
            url: 'https://htdhealth.com/',
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
