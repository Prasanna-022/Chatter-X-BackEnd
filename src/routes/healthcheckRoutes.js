import express from 'express';
import { healthcheck } from '../controllers/healthcheckController.js';

const router = express.Router();

router.route('/').get(healthcheck);

export default router;