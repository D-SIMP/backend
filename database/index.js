const mysql = require('mysql');
const util = require('util');

const db = mysql.createConnection({
    host: 'us-cdbr-east-02.cleardb.com',
    user: 'b30bb1ee83c62b',
    password: 'd1f71fa2',
    database: 'heroku_cef47dafb93fa88',
});

const query = util.promisify(db.query).bind(db);

module.exports = {
    db,
    query,
};
