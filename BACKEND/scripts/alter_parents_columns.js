import mysql from 'mysql2/promise';
import 'dotenv/config';

const alterParentsColumns = async () => {
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
        await pool.query(`ALTER TABLE ${table} DROP COLUMN parents_information`);
        console.log(`Dropped 'parents_information' from ${table}.`);
      } catch (err) {
        if (err.code === 'ER_CANT_DROP_FIELD_OR_KEY') {
          console.log(`Column 'parents_information' does not exist in ${table}.`);
        } else {
          throw err;
        }
      }

      const columnsToAdd = ['fathers_name', 'fathers_job', 'mothers_name', 'mothers_job'];
      for (const col of columnsToAdd) {
        try {
          await pool.query(`ALTER TABLE ${table} ADD COLUMN ${col} VARCHAR(100)`);
          console.log(`Added '${col}' to ${table}.`);
        } catch (err) {
          if (err.code === 'ER_DUP_FIELDNAME') {
            console.log(`Column '${col}' already exists in ${table}.`);
          } else {
            throw err;
          }
        }
      }
    }

    console.log('Successfully altered parents columns.');
    process.exit(0);
  } catch (error) {
    console.error('Error altering columns:', error);
    process.exit(1);
  }
};

alterParentsColumns();
