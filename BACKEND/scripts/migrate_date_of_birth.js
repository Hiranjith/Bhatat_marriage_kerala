import mysql from 'mysql2/promise';
import 'dotenv/config';

const migrate = async () => {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    const tables = ['christians', 'muslims', 'others'];
    
    // Add date_of_birth column
    for (const table of tables) {
      try {
        await pool.query(`ALTER TABLE ${table} ADD COLUMN date_of_birth DATE`);
        console.log(`Added date_of_birth to ${table}`);
      } catch (err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
          console.log(`Column date_of_birth already exists in ${table}`);
        } else {
          throw err;
        }
      }
    }

    // Backfill data for all tables
    const allTables = ['hindus', 'christians', 'muslims', 'others'];
    for (const table of allTables) {
      const [result] = await pool.query(`
        UPDATE ${table} t
        JOIN user_registration u ON t.profile_id = u.profile_id
        SET t.date_of_birth = u.dob
        WHERE t.date_of_birth IS NULL
      `);
      console.log(`Backfilled date_of_birth in ${table}: ${result.affectedRows} rows updated`);
    }

    console.log('Migration completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrate();
