import mysql from 'mysql2/promise';
import 'dotenv/config';
async function run(){ 
  const pool = mysql.createPool({host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_NAME}); 
  try {
    const [rows] = await pool.query('SELECT profile_created_for FROM hindus WHERE profile_id = "BKLH00000014"'); 
    console.log(rows);
  } catch(e) {
    console.error(e);
  }
  process.exit(0); 
} 
run();
