import { NextFunction, Request, Response } from 'express';
import { logger } from '../middleware/logger';
import { CDSHooksEvent } from '../types';
import { processOrderSelectHook } from './processOrderSelectHook';
import { processOrderSignHook } from './processOrderSignHook';
import { processPatientViewHook } from './processPatientViewHook';

export const routeHookRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.info('CDS services discovery endpoint called with POST method');
  const { body } = req;

  switch (body.hook) {
    case CDSHooksEvent.PATIENT_VIEW:
      processPatientViewHook(req, res, next);
      break;
    case CDSHooksEvent.ORDER_SELECT:
      processOrderSelectHook(req, res, next);
      break;
    case CDSHooksEvent.ORDER_SIGN:
      processOrderSignHook(req, res, next);
      break;
    default:
      logger.error('Unknown hook type', { hook: body.hook });
      res.status(400).json({
        error: 'Unknown hook type',
        cards: [],
      });
  }
};
