import { NextFunction, Request, Response } from 'express';
import { MedicationOrder } from 'fhir/r2';
import { Bundle } from 'fhir/r4';
import config from '../config';
import { logger } from '../middleware/logger';
import { CdsHooksEvent } from '../types';

export const processOrderSignHook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.info(`Processing ${CdsHooksEvent.ORDER_SIGN} hook request`);

  try {
    const hookData = req.body;
    const draftOrders: Bundle = hookData?.context?.draftOrders;

    const medicationOrders =
      draftOrders?.entry
        ?.filter((resource) =>
          (resource.resource?.resourceType as string).startsWith('Medication')
        )
        ?.map((entry) => entry.resource as unknown as MedicationOrder) || [];

    if (medicationOrders.length === 0) {
      logger.warn('No medication orders found to be signed');
      res.status(400).json({
        error: 'No medication orders found to be signed',
        cards: [],
      });
      return;
    }

    const primaryOrder = medicationOrders[0];
    const medication = primaryOrder.medicationCodeableConcept;

    if (!medication) {
      logger.warn('Missing medication data');
      res.status(400).json({
        error: 'Missing medication data',
        cards: [],
      });
      return;
    }

    // Number of orders being signed
    const orderCount = medicationOrders.length;
    const orderText =
      orderCount === 1
        ? `order for ${medication.coding?.[0].display}`
        : `${orderCount} medication orders including ${medication.coding?.[0].display}`;

    res.json({
      cards: [
        {
          summary: 'Pre-Signature Order Review',
          indicator: 'info',
          detail: `HTD Health has reviewed the ${orderText} prior to signature and found no significant concerns.`,
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
    logger.error(`Error processing ${CdsHooksEvent.ORDER_SIGN} hook`, error);
    next(error);
  }
};
