import bcrypt from 'bcrypt';
import bodyParser from 'body-parser';
import JWT from 'jsonwebtoken';
import express from 'express';
import DBQuery from '../../utils/db-query.js';

export default class SessionRoutes {
    static setup() {
        const sessionRouter = express.Router();

        sessionRouter.get('/', this.#getSession);
        sessionRouter.post('/', bodyParser.json(), this.#login);
        sessionRouter.delete('/:sessionUser', this.#logout);

        return sessionRouter;
    }

    static #getSession(_, res) {
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
            const token = JWT.sign({ data: user.username }, process.env.SECRET, { expiresIn: '7d' });
            res.cookie('session', token, { maxAge: 1000 * 60 * 60 * 24 * 7 });
        } catch {
            res.sendStatus(500);
            return;
        }

        res.sendStatus(200);
    }

    static #logout(req, res) {
        const sessionUser = res.get('Session-User');

        // Check if logout user matches session
        if (sessionUser !== req.params.sessionUser) {
            res.sendStatus(401);
            return;
        }

        res.clearCookie('session');
        res.sendStatus(200);
    }
}