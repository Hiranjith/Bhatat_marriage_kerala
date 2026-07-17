import mysql from 'mysql2/promise';
import 'dotenv/config';
import * as kollavarshamPkg from 'kollavarsham';

const Kollavarsham = kollavarshamPkg.Kollavarsham || kollavarshamPkg.default;
const kollavarsham = new Kollavarsham();

const migrate = async () => {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  try {
    console.log('Adding date_of_birth_malayalam column to hindus table if not exists...');
    await pool.query(`
      ALTER TABLE hindus
      ADD COLUMN IF NOT EXISTS date_of_birth_malayalam VARCHAR(100) AFTER date_of_birth;
    `);
    console.log('Column added.');

    console.log('Fetching records to backfill...');
    const [rows] = await pool.query('SELECT id, date_of_birth FROM hindus WHERE date_of_birth IS NOT NULL');
    
    let updated = 0;
    for (const row of rows) {
      if (row.date_of_birth) {
        const date = new Date(row.date_of_birth);
        if (!isNaN(date.getTime())) {
          const result = kollavarsham.fromGregorianDate(date);
          const malayalamStr = result.toString ? result.toString() : result.year + ' ' + result.month + ' ' + result.date;
          await pool.query('UPDATE hindus SET date_of_birth_malayalam = ? WHERE id = ?', [malayalamStr, row.id]);
          updated++;
        }
      }
    }
    
    console.log('Successfully updated ' + updated + ' records.');

    process.exit(0);
  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  }
};

migrate();
