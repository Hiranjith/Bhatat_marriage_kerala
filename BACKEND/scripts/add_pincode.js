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
  const tables = ['hindus', 'christians', 'muslims', 'others'];

  try {
    console.log('Connecting to database...');
    
    for (const table of tables) {
      try {
        await promisePool.query(`ALTER TABLE ${table} ADD COLUMN pincode VARCHAR(10) DEFAULT NULL;`);
        console.log(`Added pincode to ${table}`);
      } catch (err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
          console.log(`Pincode already exists in ${table}`);
        } else {
          console.error(`Error adding to ${table}:`, err.message);
        }
      }
    }

    console.log('Database altered successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Failed to alter database:', error);
    process.exit(1);
  }
};

alterDB();
