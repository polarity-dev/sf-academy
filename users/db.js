const mysql = require('mysql2')
const util = require('util')

class Db {
    constructor() {
        this.con = null;
        this.query = null;
        this.init();
    }

    init() {
        this.con = mysql.createConnection(process.env.DB_URI);
        this.query = util.promisify(this.con.query).bind(this.con);
        this.con.connect(err => {
            if (err) throw err;
            console.log("connected to the database");
        });
    }
}


module.exports = Db
