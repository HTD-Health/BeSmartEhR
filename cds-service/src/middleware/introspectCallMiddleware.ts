import { NextFunction, Request, Response } from 'express';
import { logger } from './logger';

export const introspectCallMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.info('Introspect call');

  const { body } = req;
  const accessToken = body?.fhirAuthorization?.access_token;

  try {
    const introspectRes = await fetch(
      `https://vendorservices.epic.com/interconnect-amcurprd-oauth/oauth2/Introspect`,
      {
        // https://vendorservices.epic.com/interconnect-amcurprd-oauth/api/FHIR/R4
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          token: body?.fhirAuthorization?.access_token,
          epic_user_id_type: 'internal',
        }),
      }
    );

    logger.info('Introspect response', {
      status: introspectRes.status,
      statusText: introspectRes.statusText,
    });

    if (!introspectRes.ok) {
      next();
      return;
    }

    const introspectResBody = await introspectRes.json();
    logger.info('Introspect response', {
      body: introspectResBody,
    });
  } catch (error) {
    logger.error('Error during introspection', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }

  next();
};
