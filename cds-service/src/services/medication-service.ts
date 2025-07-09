import {
  BundleEntry as BundleEntryR2,
  CodeableConcept as CodeableConceptR2,
  MedicationOrder,
  Reference as ReferenceR2,
} from 'fhir/r2';
import {
  BundleEntry,
  CodeableConcept,
  Medication,
  MedicationRequest,
  Reference,
} from 'fhir/r4';
import { MedicationDetails } from './types';

const RXNORM_SYSTEM = 'http://www.nlm.nih.gov/research/umls/rxnorm';

/**
 * Returns medication details from a FHIR Bundle entry array.
 * Supports MedicationOrder (R2) and MedicationRequest (R4),
 * with either inline CodeableConcept or referenced Medication.
 */
export const getMedicationDetails = (
  entries: (BundleEntry | BundleEntryR2)[],
  selected?: (BundleEntry | BundleEntryR2)[]
): MedicationDetails[] | undefined => {
  if (entries.length === 0) return undefined;

  const entriesToProcess = selected && selected.length > 0 ? selected : entries;

  const medicationDetails: MedicationDetails[] = [];
  for (const entry of entriesToProcess) {
    const resource = entry.resource;
    if (!resource) continue;

    switch (resource.resourceType) {
      case 'MedicationRequest':
      case 'MedicationOrder': {
        const order = resource as MedicationOrder | MedicationRequest;
        if (order.medicationCodeableConcept) {
          const details = extractFromCodeableConcept(
            order.medicationCodeableConcept
          );
          if (details) medicationDetails.push(details);
        } else if (order.medicationReference) {
          const details = resolveFromReference(
            order.medicationReference,
            entries
          );
          if (details) medicationDetails.push(details);
        }
        break;
      }
      default:
        continue;
    }
  }

  return medicationDetails;
};

const extractFromCodeableConcept = (
  concept: CodeableConcept | CodeableConceptR2
): MedicationDetails | undefined => {
  const rxNormCoding = concept.coding?.find(
    (coding) => coding.system === RXNORM_SYSTEM
  );

  return {
    rxNormCode: rxNormCoding?.code,
    displayName: concept.text,
  };
};

const resolveFromReference = (
  reference: Reference | ReferenceR2 | undefined,
  entries: (BundleEntry | BundleEntryR2)[]
): MedicationDetails | undefined => {
  const refId = reference?.reference?.split('/')?.[1];
  if (!refId) return undefined;

  const medication = entries.find(
    (entry) =>
      entry.resource?.resourceType === 'Medication' &&
      entry.resource?.id === refId
  )?.resource as Medication | undefined;

  if (!medication?.code) return undefined;

  return extractFromCodeableConcept(medication.code);
};
