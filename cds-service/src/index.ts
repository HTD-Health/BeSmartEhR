import cors from 'cors';
import express from 'express';
import fs from 'fs';
import helmet from 'helmet';
import https from 'https';
import config from './config';
import { errorHandler } from './middleware/error-handler';
import { introspectCallMiddleware } from './middleware/introspectCallMiddleware';
import { requestLogger } from './middleware/logger';
import { router } from './routes';

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

// Other middleware
app.use(introspectCallMiddleware);

// CDS Hooks routes
app.use('/', router);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'HTD Health CDS Service' });
});

// Error handling
app.use(errorHandler);

// Start server
if (process.env.USE_HTTPS === 'true') {
  const httpsOptions = {
    key: fs.readFileSync('./localhost-key.pem'),
    cert: fs.readFileSync('./localhost.pem'),
  };

  https.createServer(httpsOptions, app).listen(port, () => {
    console.log(`HTD Health CDS Service running on https://localhost:${port}`);
  });
} else {
  app.listen(port, () => {
    console.log(`HTD Health CDS Service running on http://localhost:${port}`);
  });
}
