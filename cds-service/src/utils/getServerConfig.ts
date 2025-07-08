import config from '../config';

type ServerConfig = {
  supportsHTML?: boolean;
  extension?: Record<string, string>;
  smartAppLink?: {
    label: string;
    url: string;
    type: 'smart' | 'absolute';
  };
};

export const getServerConfig = (fhirServer: string): ServerConfig => {
  if (!fhirServer) {
    return {};
  }

  switch (fhirServer) {
    case 'https://launch.smarthealthit.org/v/r2/fhir':
      return {
        supportsHTML: true,
      };
    case 'https://vendorservices.epic.com/interconnect-amcurprd-oauth/api/FHIR/R4':
      return {
        supportsHTML: true,
        extension: {
          'com.epic.cdshooks.card.detail.content-type': 'text/html',
        },
        smartAppLink: {
          label: config.smartApp.name,
          url: config.smartApp.url,
          type: 'smart',
        },
      };
    default:
      return {};
  }
};
