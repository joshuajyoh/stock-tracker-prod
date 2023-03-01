import bcrypt from 'bcrypt';
import bodyParser from 'body-parser';
import Database from '../../database.js';
import JWT from 'jsonwebtoken';
import express from 'express';

export default class SessionRoutes {
    static setup() {
        const sessionRouter = express.Router();

        sessionRouter.post('/', bodyParser.json(), this.#login);
        sessionRouter.delete('/:sessionUser', this.#logout);

        return sessionRouter;
    }

    static async #login(req, res) {
        let queryResult;

        const username = req.body.username;
        const password = req.body.password;

        // Check if username exists
        // TODO: Prevent timing attacks

        queryResult = await new Promise((resolve, _) => {
            Database.Connection.query(`SELECT COUNT(*) AS count FROM User WHERE username = ?`, [username], (err, results) => {
                if (err) {
                    throw new Error('Query failed');
                }
                
                resolve(results[0].count);
            });
        }); 

        if (queryResult === 0) {
            res.sendStatus(400);
            return;
        }

        // Validate password

        const user = await new Promise((resolve, _) => {
            Database.Connection.query(`SELECT * FROM User WHERE username = ?`, [username], (err, results) => {
                if (err) {
                    throw new Error('Query failed');
                }
                
                resolve(results[0]);
            });
        });

        const passwordIsCorrect = await bcrypt.compare(password, user.password);

        if (!passwordIsCorrect) {
            res.sendStatus(400);
            return;
        }

        // Create JWT session

        try {
            const token = JWT.sign({ data: user.username }, process.env.SECRET, { expiresIn: '30s' });
            res.cookie('session', token, { maxAge: '30000' });
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