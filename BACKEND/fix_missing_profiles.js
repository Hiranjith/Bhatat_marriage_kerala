import mysql from 'mysql2/promise';
import 'dotenv/config';

async function fixMissingProfiles() {
  const pool = mysql.createPool({host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_NAME}); 
  try {
    const [users] = await pool.query('SELECT * FROM user_registration');
    for (const user of users) {
      if (!user.profile_id) continue;
      
      let matchingTable = 'others';
      switch (user.religion) {
        case 'Hindu': matchingTable = 'hindus'; break;
        case 'Christian': matchingTable = 'christians'; break;
        case 'Muslim': matchingTable = 'muslims'; break;
      }

      const [existing] = await pool.query(`SELECT id FROM ${matchingTable} WHERE profile_id = ?`, [user.profile_id]);
      
      if (existing.length === 0) {
        let age = null;
        if (user.dob) {
           const dobDate = new Date(user.dob);
           const diff = Date.now() - dobDate.getTime();
           const ageDate = new Date(diff); 
           age = Math.abs(ageDate.getUTCFullYear() - 1970);
        }

        await pool.query(
          `INSERT INTO ${matchingTable} (profile_id, name, gender, age) VALUES (?, ?, ?, ?)`,
          [user.profile_id, user.full_name, user.gender, age]
        );
        console.log(`Inserted ${user.full_name} into ${matchingTable}`);
      }
    }
    console.log('Done fixing profiles.');
  } catch(e) {
    console.error(e);
  }
  process.exit(0);
}
fixMissingProfiles();
