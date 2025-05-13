import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import cors from 'cors';
import express from 'express';
import morgan from 'morgan';

// __dirname workaround for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}

// POST endpoint for logging
app.post('/api/log', (req, res) => {
    const { timestamp, type, data } = req.body;
    const logEntry = `[${timestamp}] ${type?.toUpperCase()}: ${JSON.stringify(data)}\n`;

    fs.appendFile(path.join(logsDir, 'api.log'), logEntry, (err) => {
        if (err) {
            console.error('Error writing to log file:', err);
            res.status(500).json({ error: 'Failed to write log' });
        } else {
            process.stdout.write(logEntry);
            res.status(200).json({ success: true });
        }
    });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
    const buildPath = path.join(__dirname, 'build');
    app.use(express.static(buildPath));
    app.get('*', (req, res) => {
        res.sendFile(path.join(buildPath, 'index.html'));
    });
}

app.listen(PORT, () => {
    console.info(`Server is running on port ${PORT}`);
});
