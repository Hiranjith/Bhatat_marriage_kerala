import pool from './config/db.js';

async function fixGenders() {
  try {
    const tables = ['user_registration', 'hindus', 'christians', 'muslims', 'others'];
    
    for (const table of tables) {
      const query = `
        UPDATE ${table} 
        SET gender = CASE 
          WHEN gender = 'Male' THEN 'Female'
          WHEN gender = 'Female' THEN 'Male'
          ELSE gender
        END
        WHERE gender IN ('Male', 'Female')
      `;
      const [result] = await pool.query(query);
      console.log(`Updated ${result.affectedRows} rows in ${table}`);
    }
  } catch (error) {
    console.error('Error updating genders:', error);
  } finally {
    process.exit(0);
  }
}

fixGenders();
