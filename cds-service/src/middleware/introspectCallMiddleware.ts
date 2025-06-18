import { NextFunction, Request, Response } from 'express';
import { logger } from './logger';

export const introspectCallMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.info('Introspect call');

  const { body } = req;
  const fhirServer = body?.fhirServer as string;

  const introspectRes = await fetch(`${fhirServer}/oauth2/Introspect`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token: body?.fhirAuthorization?.access_token,
      epic_user_id_type: 'internal',
    }),
  });

  const introspectResBody = await introspectRes.json();

  logger.info('Introspect response', {
    status: introspectRes.status,
    statusText: introspectRes.statusText,
    body: introspectResBody,
  });

  next();
};
