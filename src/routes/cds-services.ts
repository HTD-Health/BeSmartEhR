import { Router } from 'express';
import { getCdsServices } from '../controllers/getCdsServices';
import { processOrderSelectHook } from '../controllers/processOrderSelectHook';
import { processPatientViewHook } from '../controllers/processPatientViewHook';
import { Services } from '../types';

const router = Router();

router.get('/cds-services', getCdsServices);
router.post(
  `/cds-services/${Services.PATIENT_ASSESSMENT}`,
  processPatientViewHook
);
router.post(
  `/cds-services/${Services.ORDER_ASSISTANT}`,
  processOrderSelectHook
);

export { router };
