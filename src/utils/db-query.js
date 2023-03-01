import Database from '../database.js';

// Functions for making database queries
export default class DBQuery {
    // Make a query with no parameters
    static query(qry) {
        return new Promise((resolve, reject) => {
            Database.Connection.query(qry, (err, results) => {
                if (err) {
                    reject(new Error('Query failed'));
                    return;
                }
                
                resolve(results);
            });
        });
    }

    // Make a query with parameters
    static query(qry, params) {
        return new Promise((resolve, reject) => {
            Database.Connection.query(qry, params, (err, results) => {
                if (err) {
                    reject(new Error('Query failed'));
                    return;
                }
                
                resolve(results);
            });
        });
    }
}