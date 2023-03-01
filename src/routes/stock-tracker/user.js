import bcrypt from 'bcrypt';
import bodyParser from 'body-parser';
import Database from '../../database.js';
import express from 'express';

export default class UserRoutes {
    static setup() {
        const userRouter = express.Router();

        userRouter.post('/', bodyParser.json(), this.#addUser);

        return userRouter;
    }

    static async #addUser(req, res) {
        let queryResult;

        const username = req.body.username;
        const password = req.body.password;

        // Check if username already exists

        queryResult = await new Promise((resolve, _) => {
            Database.Connection.query(`SELECT COUNT(*) AS count FROM User WHERE username = ?`, [username], (err, results) => {
                if (err) {
                    throw new Error('Query failed');
                }
                
                resolve(results[0].count);
            });
        }); 

        if (queryResult > 0) {
            res.sendStatus(400);
            return;
        }

        // Encrypt password

        const hash = await bcrypt.hash(password, 10);

        // Insert into database

        Database.Connection.query(`INSERT INTO User VALUES (?, ?, '')`, [username, hash]);

        res.sendStatus(200);
    }
}