import mysql from 'mysql2/promise';
import 'dotenv/config';

const addColumns = async () => {
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
      
      // Add country
      try {
        await pool.query(`ALTER TABLE ${table} ADD COLUMN country VARCHAR(100)`);
        console.log(`Added 'country' column to ${table}.`);
      } catch (err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
          console.log(`Column 'country' already exists in ${table}.`);
        } else {
          throw err;
        }
      }

      // Add district
      try {
        await pool.query(`ALTER TABLE ${table} ADD COLUMN district VARCHAR(100)`);
        console.log(`Added 'district' column to ${table}.`);
      } catch (err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
          console.log(`Column 'district' already exists in ${table}.`);
        } else {
          throw err;
        }
      }
    }

    // Update existing sample data with country and district
    // Hindus
    await pool.query(`UPDATE hindus SET country = 'India', district = 'Ernakulam' WHERE name = 'Rahul Sharma'`);
    await pool.query(`UPDATE hindus SET country = 'India', district = 'Trivandrum' WHERE name = 'Anjali Menon'`);
    
    // Christians
    await pool.query(`UPDATE christians SET country = 'India', district = 'Kottayam' WHERE name = 'Kevin Mathew'`);
    await pool.query(`UPDATE christians SET country = 'UK', district = 'Thrissur' WHERE name = 'Sara Varghese'`);
    
    // Muslims
    await pool.query(`UPDATE muslims SET country = 'UAE', district = 'Kozhikode' WHERE name = 'Mohammed Tariq'`);
    await pool.query(`UPDATE muslims SET country = 'India', district = 'Malappuram' WHERE name = 'Fathima Noor'`);
    
    // Others
    await pool.query(`UPDATE others SET country = 'Canada', district = 'Palakkad' WHERE name = 'Harpreet Singh'`);
    await pool.query(`UPDATE others SET country = 'India', district = 'Ernakulam' WHERE name = 'Priya Jain'`);
    
    console.log('Sample data successfully updated with country and district fields.');

    process.exit(0);
  } catch (error) {
    console.error('Error adding location columns:', error);
    process.exit(1);
  }
};

addColumns();
