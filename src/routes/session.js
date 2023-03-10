import bcrypt from 'bcrypt';
import bodyParser from 'body-parser';
import JWT from 'jsonwebtoken';
import express from 'express';
import DBQuery from '../utils/db-query.js';

export default class SessionRoutes {
    static setup() {
        const sessionRouter = express.Router();

        sessionRouter.get('/user', this.#getSessionUser);
        sessionRouter.post('/', bodyParser.json(), this.#login);
        sessionRouter.delete('/', this.#logout);

        return sessionRouter;
    }

    static #getSessionUser(_, res) {
        const username = res.get('Session-User');

        if (username === '') {
            res.sendStatus(404);
            return;
        }

        const responseBody = {
            username: username
        };

        res.json(responseBody);
        res.status(200);
    }

    static async #login(req, res) {
        let queryResult;

        const username = req.body.username;
        const password = req.body.password;

        // Check if username exists
        // TODO: Prevent timing attacks

        try {
            queryResult = await DBQuery.query(`SELECT COUNT(*) AS count FROM User WHERE username = ?`, [username]);
        } catch {
            res.sendStatus(500);
            return;
        }

        if (queryResult[0].count === 0) {
            res.sendStatus(400);
            return;
        }

        // Validate password

        try {
            queryResult = await DBQuery.query(`SELECT * FROM User WHERE username = ?`, [username]);
        } catch {
            res.sendStatus(500);
            return;
        }

        const user = queryResult[0];

        const passwordIsCorrect = await bcrypt.compare(password, user.password);

        if (!passwordIsCorrect) {
            res.sendStatus(400);
            return;
        }

        // Create JWT session

        try {
            const token = JWT.sign({ data: user.username }, process.env.SECRET, { expiresIn: '1d' });

            res.cookie('session', token, {
                httpOnly: true,
                secure: true
            });
            res.sendStatus(200);
        } catch {
            res.sendStatus(500);
        }
    }

    static async #logout(_, res) {
        res.clearCookie('session');
        res.sendStatus(200);
    }
}