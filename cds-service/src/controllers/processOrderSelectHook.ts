import { NextFunction, Request, Response } from 'express';
import { Bundle, CodeableConcept } from 'fhir/r4';
import config from '../config';
import { logger } from '../middleware/logger';
import { CDSHooksEvent } from '../types';

export const processOrderSelectHook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const hookData = req.body;
    const selections: string[] = hookData?.context?.selections;
    const draftOrders: Bundle = hookData?.context?.draftOrders;

    if (!selections || selections.length < 1 || !draftOrders) {
      logger.warn('Missing selections or draftOrders in context');
      res.status(400).json({
        error: 'Missing required selections or draftOrders data',
        cards: [],
      });
      return;
    }

    const [selectionType, selectionId] = selections[0].split('/');

    const medicationResource = draftOrders?.entry?.find(
      (resource) =>
        (resource.resource?.resourceType as string) === selectionType &&
        (resource.resource?.id as string) === selectionId
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
            {
              label: 'More about HTD Health',
              url: `https://htdhealth.com/`,
              type: 'absolute',
            },
          ],
        },
      ],
    });
  } catch (error) {
    logger.error(`Error processing ${CDSHooksEvent.ORDER_SELECT} hook`, error);
    next(error);
  }
};
