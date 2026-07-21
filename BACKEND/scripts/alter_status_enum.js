import mysql from 'mysql2';
import 'dotenv/config';

const alterDB = async () => {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  const promisePool = pool.promise();

  try {
    console.log('Connecting to MariaDB...');
    
    // Changing the ENUM requires redefining it entirely.
    await promisePool.query("ALTER TABLE user_registration MODIFY COLUMN status ENUM('ACTIVE', 'BLOCKED', 'BANNED', 'FREEZED', 'REPORTED') DEFAULT 'ACTIVE';");
    console.log('Modified status enum');
    
    console.log('All columns modified successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Failed to alter database:', error);
    process.exit(1);
  }
};

alterDB();
