import { NextFunction, Request, Response } from 'express';
import { Bundle, CodeableConcept, Medication, Reference } from 'fhir/r4';
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
        resource.resource?.resourceType === selectionType &&
        resource.resource?.id === selectionId
    )?.resource as unknown as Record<string, unknown>; // MedicationRequest | MedicationOrder

    if (!medicationResource) {
      logger.warn('Missing selected medication resource data');
      res.status(400).json({
        error: 'Missing selected medication resource data',
        cards: [],
      });
      return;
    }

    let medicationCodeableConcept: CodeableConcept | undefined =
      medicationResource?.medicationCodeableConcept as CodeableConcept;

    if (!medicationCodeableConcept) {
      const medicationReference = (
        medicationResource?.medicationReference as Reference
      )?.reference;
      if (medicationReference) {
        const medicationId = medicationReference.split('/')[1];
        const medication = draftOrders?.entry?.find(
          (resource) => resource.resource?.id === medicationId
        )?.resource as Medication;
        medicationCodeableConcept = medication?.code;
      }
    }

    if (!medicationCodeableConcept) {
      logger.warn('Missing medication data');
      res.status(400).json({
        error: 'Missing medication data',
        cards: [],
      });
      return;
    }

    const medicationRxNormCode = medicationCodeableConcept?.coding?.find(
      (coding) =>
        coding.system === 'http://www.nlm.nih.gov/research/umls/rxnorm'
    );

    res.json({
      cards: [
        {
          summary: 'Order Selection Review',
          indicator: 'info',
          detail: `HTD Health has reviewed order of ${medicationCodeableConcept?.text}.`,
          source: {
            label: config.serviceName,
            url: 'https://cds-service.htdhealth.com/',
            icon: config.icons.logo,
          },
          links: [
            {
              label: 'View RxNorm Medication Information',
              url: `https://mor.nlm.nih.gov/RxNav/search?searchBy=RXCUI&searchTerm=${medicationRxNormCode?.code}`,
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
