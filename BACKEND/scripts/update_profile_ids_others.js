import mysql from 'mysql2';
import 'dotenv/config';

const updateProfileIds = async () => {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  const promisePool = pool.promise();

  try {
    await promisePool.query(
      `UPDATE user_registration SET profile_id = 'BKLT00000001' WHERE email_address = 'priya@example.com'`
    );
    console.log('Updated priya@example.com profile_id to BKLT00000001');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

updateProfileIds();
