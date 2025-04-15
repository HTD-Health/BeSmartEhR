import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import config from './config';
import { errorHandler } from './middleware/error-handler';
import { requestLogger } from './middleware/logger';
import { router as cdsRouter } from './routes/cds-services';

const app = express();
const port = config.port;

// Security middleware
app.use(helmet());
app.use(cors());

// Request parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(requestLogger);

// CDS Hooks routes
app.use('/', cdsRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'HTD Health CDS Service' });
});

// Error handling
app.use(errorHandler);

// Start server
app.listen(port, () => {
  console.log(`HTD Health CDS Service running on port ${port}`);
});
