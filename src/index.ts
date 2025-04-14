import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import config from './config';
import { errorHandler } from './middleware/error-handler';
import { requestLogger } from './middleware/request-logger';
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
app.use(morgan('combined'));
app.use(requestLogger);

// Error handling
app.use(errorHandler);

// CDS Hooks routes
app.use('/', cdsRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'HTD Health CDS Service' });
});

// Start server
app.listen(port, () => {
  console.log(`HTD Health CDS Service running on port ${port}`);
});
