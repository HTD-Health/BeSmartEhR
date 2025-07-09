import { NextFunction, Request, Response } from 'express';
import { Bundle } from 'fhir/r4';
import config from '../config';
import { logger } from '../middleware/logger';
import { getMedicationDetails } from '../services/medication-service';
import { CDSHooksEvent } from '../types';

export const processOrderSignHook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const hookData = req.body;
    const draftOrders: Bundle = hookData?.context?.draftOrders;

    if (!draftOrders?.entry) {
      logger.warn('Missing draftOrders in context');
      res.status(400).json({
        error: 'Missing required draftOrders data',
        cards: [],
      });
      return;
    }

    const medicationDetails = getMedicationDetails(draftOrders.entry);

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
        ? `HTD Health has reviewed the order of ${medicationDetails[0]?.displayName} prior to signature and found no significant concerns.`
        : `HTD Health has reviewed the order of ${medicationDetails?.length} selections prior to signature and found no significant concerns.`;

    res.json({
      cards: [
        {
          summary: 'Pre-Signature Order Review',
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
    logger.error(`Error processing ${CDSHooksEvent.ORDER_SIGN} hook`, error);
    next(error);
  }
};
