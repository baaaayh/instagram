const { Pool } = require("pg");
const dotenv = require("dotenv");
require("dotenv").config();

dotenv.config();

const pool = new Pool({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

pool.connect()
    .then(() => {
        console.log("PostgreSQL connected!");
    })
    .catch((error) => {
        console.log("PostgreSQL connection error : ", error);
    });

module.exports = pool;
