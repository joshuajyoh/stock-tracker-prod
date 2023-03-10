import cookieParser from 'cookie-parser';
import cors from 'cors';
import Database from './src/database.js';
import * as Env from 'dotenv';
import express from 'express';
import * as FileSystem from 'fs';
import * as HTTP from 'http';
import * as HTTPS from 'https';
import * as Path from 'path';
import StockTrackerRoutes from './src/routes/stock-tracker.js';
import Token from './src/middleware/token.js';

Env.config();

const ENV = process.env.ENV;

const app = express();
app.use(express.static('public'));
app.use(cookieParser());

// Set up Stock Tracker routes
app.use('/api/stock-tracker', cors(), Token.verify, StockTrackerRoutes.setup());

// Set up database
Database.setup();

app.get('/', (_, res) => {
    res.sendFile(Path.resolve('./index.html'));
});

// HTTP Setup

if (ENV === 'dev') {
    const httpServer = HTTP.createServer(app);

    httpServer.listen(80, () => {
        console.log('HTTP Server running on port 80');
    });
}

// HTTPS Setup

if (ENV === 'prod') {
    const privateKey = FileSystem.readFileSync('/etc/letsencrypt/live/joshuajyoh.com/privkey.pem', 'utf8');
    const certificate = FileSystem.readFileSync('/etc/letsencrypt/live/joshuajyoh.com/cert.pem', 'utf8');
    const ca = FileSystem.readFileSync('/etc/letsencrypt/live/joshuajyoh.com/chain.pem', 'utf8');

    const creds = {
        key: privateKey,
        cert: certificate,
        ca: ca
    };

    const httpsServer = HTTPS.createServer(creds, app);

    httpsServer.listen(443, () => {
        console.log('HTTPS Server running on port 443');
    });
}

