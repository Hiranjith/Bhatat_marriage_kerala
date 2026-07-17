import mysql from 'mysql2/promise';
import 'dotenv/config';

const addStateColumn = async () => {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  const tables = ['hindus', 'christians', 'muslims', 'others'];

  try {
    for (const table of tables) {
      console.log(`Checking table ${table}...`);
      
      try {
        await pool.query(`ALTER TABLE ${table} ADD COLUMN state VARCHAR(100)`);
        console.log(`Added 'state' column to ${table}.`);
      } catch (err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
          console.log(`Column 'state' already exists in ${table}.`);
        } else {
          throw err;
        }
      }

      // Update existing sample data with state = 'Kerala'
      await pool.query(`UPDATE ${table} SET state = 'Kerala'`);
    }

    console.log('Sample data successfully updated with state = Kerala.');

    process.exit(0);
  } catch (error) {
    console.error('Error adding state column:', error);
    process.exit(1);
  }
};

addStateColumn();
