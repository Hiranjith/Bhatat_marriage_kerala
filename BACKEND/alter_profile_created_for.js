import mysql from 'mysql2/promise';
import 'dotenv/config';
async function run(){ 
  const pool = mysql.createPool({
    host: process.env.DB_HOST, 
    user: process.env.DB_USER, 
    password: process.env.DB_PASSWORD, 
    database: process.env.DB_NAME
  }); 
  const tables = ['hindus', 'christians', 'muslims', 'others']; 
  for (const table of tables) { 
    try { 
      await pool.query(`ALTER TABLE ${table} MODIFY profile_created_for ENUM('Myself', 'Son', 'Daughter', 'Brother', 'Sister', 'Relative', 'Friend')`); 
      console.log('Altered', table); 
    } catch(e) { 
      console.error('Error altering', table, e.message); 
    } 
  } 
  process.exit(0); 
} 
run();
