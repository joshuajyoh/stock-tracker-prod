import * as MySQL from 'mysql2';

export default class Database {
    static #connection;

    static get Connection() {
        return this.#connection;
    }

    static setup() {
        this.#connection = MySQL.createConnection({
            host: process.env.DBMS_HOST,
            user: process.env.DBMS_USER,
            password: process.env.DBMS_PASS,
        });

        this.#connection.connect((err) => {
            if (err) {
                console.error('Failed to connect to DBMS: ' + err.stack);
                return;
            }

            console.log('Connected to DBMS as ID ' + this.#connection.threadId);
        });

        this.#connection.query(`SET session wait_timeout=2630000`, (err) => {
            if (err) {
                console.error('Failed to configure connection settings');
            }
        });

        this.#connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`, (err) => {
            if (err) {
                console.error('Failed to create database');
            }
        });

        this.#connection.query(`USE ${process.env.DB_NAME}`, (err) => {
            if (err) {
                console.error('');
            }
        });

        this.#connection.query('CREATE TABLE IF NOT EXISTS User(username VARCHAR(30), password VARCHAR(100) NOT NULL, saved_data TEXT, PRIMARY KEY (username))', (err) => {
            if (err) {
                console.error('');
            }
        });
    }
}