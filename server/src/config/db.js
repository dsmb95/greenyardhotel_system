import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

// --------------------------------------------------------------
// Creates a reusable pool for the app
// --------------------------------------------------------------
export const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 3307),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "greenyard",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    decimalNumbers: true,
    dateStrings: true,
});

// --------------------------------------------------------------
// Create a pool without a database for setup scripts
// --------------------------------------------------------------
export const rootPool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 3307),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    multipleStatements: true,
})