import { NextFunction, Request, Response } from 'express';
import { Bundle } from 'fhir/r4';
import config from '../config';
import { logger } from '../middleware/logger';
import { getMedicationDetails } from '../services/medication-service';
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

    if (!selections || selections.length < 1 || !draftOrders?.entry) {
      logger.warn('Missing selections or draftOrders in context');
      res.status(400).json({
        error: 'Missing required selections or draftOrders data',
        cards: [],
      });
      return;
    }

    const selectedMedicationEntries = draftOrders?.entry.filter((entry) => {
      const reference = `${entry.resource?.resourceType}/${entry.resource?.id}`;
      return selections.includes(reference);
    });

    if (!selectedMedicationEntries || selectedMedicationEntries.length < 1) {
      logger.warn('Missing selected medication resource data');
      res.status(400).json({
        error: 'Missing selected medication resource data',
        cards: [],
      });
      return;
    }

    const medicationDetails = getMedicationDetails(
      draftOrders.entry,
      selectedMedicationEntries
    );

    if (!medicationDetails || medicationDetails.length < 1) {
      logger.warn('No medication details found for selected order');
      res.status(400).json({
        error: 'No medication details found for selected order',
        cards: [],
      });
      return;
    }

    const detailText =
      medicationDetails?.length == 1
        ? `HTD Health has reviewed the order of ${medicationDetails[0]?.displayName}.`
        : `HTD Health has reviewed the order of ${medicationDetails?.length} selections.`;

    res.json({
      cards: [
        {
          summary: 'Order Selection Review',
          indicator: 'info',
          detail: detailText,
          source: {
            label: config.serviceName,
            url: 'https://cds-service.htdhealth.com/',
            icon: config.icons.logo,
          },
          links: [
            ...medicationDetails?.map((det) => ({
              label: `View RxNorm Information: ${det.displayName}`,
              url: `https://mor.nlm.nih.gov/RxNav/search?searchBy=RXCUI&searchTerm=${det.rxNormCode}`,
              type: 'absolute',
            })),
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
