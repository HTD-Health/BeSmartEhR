const express = require('express');
const path = require('path');
const fs = require('fs');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(morgan('dev')); // HTTP request logging

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}

// Endpoint to receive logs
app.post('/api/log', (req, res) => {
    const { timestamp, type, data } = req.body;
    const logEntry = `[${timestamp}] ${type.toUpperCase()}: ${JSON.stringify(data)}\n`;
    
    fs.appendFile(path.join(logsDir, 'api.log'), logEntry, (err) => {
        if (err) {
            console.error('Error writing to log file:', err);
            res.status(500).json({ error: 'Failed to write log' });
        } else {
            // Also print to terminal
            process.stdout.write(logEntry);
            res.status(200).json({ success: true });
        }
    });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'build')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'build', 'index.html'));
    });
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 