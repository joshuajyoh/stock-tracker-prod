import express from "express";
import * as HTTPS from 'https';

export default class FinanceRoutes {
    static setup() {
        const financeRouter = express.Router();

        financeRouter.get('/', this.#get);

        return financeRouter;
    }

    static async #get(req, res) {
        const symbol = req.query.symbol;

        if (symbol === undefined || symbol === '') {
            res.sendStatus(400);
            return;
        }

        const data = {
            symbol: symbol,
            fullName: null,
            currency: null,
            price: null,
            history: null
        };

        const detailsPromise = FinanceRoutes.#getDetails(symbol, data);
        const historyPromise = FinanceRoutes.#getHistory(symbol, data);

        try {
            await Promise.all([detailsPromise, historyPromise]);
        } catch (errorCode) {
            res.sendStatus(errorCode);
            return;
        }

        res.status(200);
        res.set('Access-Control-Allow-Origin', '*');
        res.json(data);
    }

    static #getDetails(stockSymbol, stockData) {
        const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${stockSymbol}`;
		
        return new Promise((resolve, reject) => {
            HTTPS.get(url, (res) => {
                let raw = '';

                res.on('data', (chunk) => {
                    raw += chunk;
                });

                res.on('end', () => {
                    const data = JSON.parse(raw);
                    
                    if (data.quoteResponse.result.length === 0) {
                        reject(404);
                        return;
                    }

                    stockData.symbol = data.quoteResponse.result[0].symbol;
                    stockData.fullName = data.quoteResponse.result[0].longName;
                    stockData.currency = data.quoteResponse.result[0].currency;
                    stockData.price = data.quoteResponse.result[0].regularMarketPrice;
                    
                    resolve();
                });

                res.on('error', () => {
                    reject(500);
                });
            });
        });
    }

    static #getHistory(stockSymbol, stockData) {
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${stockSymbol}?close=adjusted&interval=1d&range=1y`;
		
        return new Promise((resolve, reject) => {
            HTTPS.get(url, (res) => {
                if (res.statusCode !== 200) {
                    reject(res.statusCode);
                    return;
                }

                let raw = '';

                res.on('data', (chunk) => {
                    raw += chunk;
                });

                res.on('end', () => {
                    const data = JSON.parse(raw);
                    stockData.history = data.chart.result[0].indicators.quote[0];

                    resolve();
                });

                res.on('error', (error) => {
                    reject(500);
                });
            });
        });
    }
}