import * as Env from 'dotenv';
import express from 'express';
import * as Path from 'path';

Env.config();

const host = process.env.HOST;
const port = process.env.PORT;

const app = express();

app.use(express.static('public'));

app.get('/stock-tracker', (_, res) => {
    res.sendFile(Path.resolve('./index.html'));
})

app.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}/`);
});