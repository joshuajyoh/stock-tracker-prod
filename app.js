import * as Env from 'dotenv';
import express from 'express';
import * as Path from 'path';
import StockDataRoutes from './src/routes/stock-data';

Env.config();

const host = process.env.HOST;
const port = process.env.PORT;

const app = express();

app.use(express.static('public'));

app.get('/', (_, res) => {
    res.sendFile(Path.resolve('./pages/home.html'));
})

app.get('/stock-tracker', (_, res) => {
    res.sendFile(Path.resolve('./pages/stock-tracker.html'));
})

StockDataRoutes.setup(app);

app.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}/`);
});