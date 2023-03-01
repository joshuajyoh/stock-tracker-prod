import bcrypt from 'bcrypt';
import bodyParser from 'body-parser';
import Database from '../../database.js';
import JWT from 'jsonwebtoken';
import express from 'express';

export default class SessionRoutes {
    static setup() {
        const sessionRouter = express.Router();

        sessionRouter.post('/', bodyParser.json(), this.#login);

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
            const token = JWT.sign({ data: user.username }, process.env.SECRET, { expiresIn: '5s' });
            res.cookie('session', token, { maxAge: '5000' });
        } catch {
            res.sendStatus(500);
            return;
        }

        res.sendStatus(200);
    }
}