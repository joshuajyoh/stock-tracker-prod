import * as Env from 'dotenv';
import express from 'express';
import * as FileSystem from 'fs';
import * as HTTP from 'http';
import * as HTTPS from 'https';
import * as Path from 'path';
import StockDataRoutes from './src/routes/stock-data.js';

Env.config();

const ENV = process.env.ENV;

const app = express();

app.use(express.static('public'));

app.get('/', (_, res) => {
    res.sendFile(Path.resolve('./pages/home.html'));
})

app.get('/stock-tracker', (_, res) => {
    res.redirect('https://joshuajyoh.github.io/stock-tracker/');
})

StockDataRoutes.setup(app);

// HTTP Setup

const httpServer = HTTP.createServer(app);

httpServer.listen(80, () => {
	console.log('HTTP Server running on port 80');
});

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

