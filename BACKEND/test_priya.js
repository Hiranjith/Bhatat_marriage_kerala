import mysql from 'mysql2/promise';
import 'dotenv/config';
async function run(){ 
  const pool = mysql.createPool({
    host: process.env.DB_HOST, 
    user: process.env.DB_USER, 
    password: process.env.DB_PASSWORD, 
    database: process.env.DB_NAME
  }); 
  try { 
    const query = `UPDATE others SET name = ?, gender = ?, age = ?, height = ?, marital_status = ?, profile_created_for = ?, education = ?, profession = ?, country = ?, state = ?, district = ?, place = ?, fathers_name = ?, fathers_job = ?, mothers_name = ?, mothers_job = ?, sibling_details = ?, about_me = ?, birth_time = ?, nakshatra = ?, rasi = ?, date_of_birth = COALESCE(?, date_of_birth) WHERE profile_id = ?`; 
    const values = ['Priya Agarwal', null, 25, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 'BKLT00000012']; 
    await pool.query(query, values); 
    console.log('SUCCESS'); 
  } catch(e) { 
    console.error('SQL ERROR:', e.message); 
  } 
  process.exit(0); 
} 
run();
