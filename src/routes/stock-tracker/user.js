import bcrypt from 'bcrypt';
import bodyParser from 'body-parser';
import Database from '../../database.js';
import express from 'express';

export default class UserRoutes {
    static setup() {
        const userRouter = express.Router();

        userRouter.post('/', bodyParser.json(), this.#addUser);
        userRouter.get('/:user/saved-data', this.#getSavedData);
        userRouter.put('/:user/saved-data', bodyParser.json(), this.#updateSavedData);
        userRouter.delete('/:user', this.#deleteUser);

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

    static async #getSavedData(req, res) {
        const username = req.params.user;
        const sessionUser = res.get('Session-User');

        // Check authorization

        if (username !== sessionUser) {
            res.sendStatus(401);
            return;
        }

        // Get saved data

        let queryResult;

        try {
            queryResult = await new Promise((resolve, reject) => {
                Database.Connection.query(`SELECT saved_data FROM User WHERE username = ?`, [username], (err, result) => {
                    if (err) {
                        reject(new Error('Query failed'));
                    }
                    
                    resolve(result);
                });
            }); 
        } catch {
            res.sendStatus(500);
            return;
        }

        const savedData = JSON.parse(queryResult[0].saved_data)

        res.json(savedData);
        res.status(200);
    }

    static async #updateSavedData(req, res) {
        const username = req.params.user;
        const sessionUser = res.get('Session-User');

        // Check authorization

        if (username !== sessionUser) {
            res.sendStatus(401);
            return;
        }

        const savedData = JSON.stringify(req.body.data);

        // Update saved data

        try {
            await new Promise((resolve, reject) => {
                Database.Connection.query(`UPDATE User SET saved_data = ? WHERE username = ?`, [savedData, username], (err, _) => {
                    if (err) {
                        reject(new Error('Query failed'));
                    }
                    
                    resolve();
                });
            }); 
        } catch {
            res.sendStatus(500);
            return;
        }

        res.sendStatus(200);
    }

    static async #deleteUser(req, res) {
        const username = req.params.user;
        const sessionUser = res.get('Session-User');

        // Check authorization

        if (username !== sessionUser) {
            res.sendStatus(401);
            return;
        }

        // Delete user

        try {
            await new Promise((resolve, reject) => {
                Database.Connection.query(`DELETE FROM User WHERE username = ?`, [username], (err, _) => {
                    if (err) {
                        reject(new Error('Query failed'));
                    }
                    
                    resolve();
                });
            }); 
        } catch {
            res.sendStatus(500);
            return;
        }

        res.sendStatus(200);
    }
}