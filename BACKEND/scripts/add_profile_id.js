import mysql from 'mysql2';
import 'dotenv/config';

const alterTable = async () => {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  const promisePool = pool.promise();

  try {
    // Add profile_id column if it doesn't exist
    await promisePool.query('ALTER TABLE user_registration ADD COLUMN profile_id VARCHAR(20) UNIQUE AFTER id;');
    console.log('Added profile_id column to user_registration table.');
    process.exit(0);
  } catch (error) {
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log('Column profile_id already exists.');
      process.exit(0);
    } else {
      console.error('Error altering table:', error.message);
      process.exit(1);
    }
  }
};

alterTable();
