import mysql from 'mysql2/promise';
import pool from './db.js';

async function initializeDatabase() {
  //  prevent injection
  const dbName = (process.env.DB_NAME || 'school_management').replace(/[^a-zA-Z0-9_]/g, '');

  // First create the database if it doesn't exist (connect without specifying DB)
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    ssl: process.env.DB_HOST !== 'localhost' ? { rejectUnauthorized: false } : undefined,
  });

  await connection.execute(
    `CREATE DATABASE IF NOT EXISTS \`${dbName}\``
  );
  await connection.end();

  // Now create the table using the pool (which targets the DB)
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS schools (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      address VARCHAR(255) NOT NULL,
      latitude DOUBLE NOT NULL,
      longitude DOUBLE NOT NULL
    )
  `);

  console.log('Database & schools table ready');
}

export default initializeDatabase;
