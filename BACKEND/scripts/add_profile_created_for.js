import mysql from 'mysql2';
import 'dotenv/config';

const alterTables = async () => {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  const promisePool = pool.promise();
  const tables = ['hindus', 'christians', 'muslims', 'others'];

  for (const table of tables) {
    try {
      // Add profile_created_for column if it doesn't exist
      await promisePool.query(`ALTER TABLE ${table} ADD COLUMN profile_created_for VARCHAR(100) AFTER user_id;`);
      console.log(`Added profile_created_for column to ${table} table.`);
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log(`Column profile_created_for already exists in ${table}.`);
      } else {
        console.error(`Error altering table ${table}:`, error.message);
      }
    }
  }
  
  process.exit(0);
};

alterTables();
