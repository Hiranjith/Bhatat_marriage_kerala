import mysql from 'mysql2';
import 'dotenv/config';

const fixProfileIds = async () => {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  const promisePool = pool.promise();

  try {
    // 1. Temporarily clear profile_ids to avoid unique constraint violations
    await promisePool.query('UPDATE user_registration SET profile_id = CONCAT("TEMP_", id)');

    // 2. Fetch users and assign correct sequence
    const [users] = await promisePool.query('SELECT id, religion, district FROM user_registration');

    for (const u of users) {
      const stateCode = 'KL';
      let religionInitial = u.religion ? u.religion.charAt(0).toUpperCase() : 'T';
      if (u.religion === 'Other') {
        religionInitial = 'T';
      }
      
      let districtCode = '00';
      if (u.district) {
        const match = u.district.match(/^(\d{2})/);
        if (match) {
          districtCode = match[1];
        }
      }
      
      const paddedId = String(u.id).padStart(9, '0');
      const profileId = `B${stateCode}${religionInitial}${districtCode}${paddedId}`;

      await promisePool.query(
        'UPDATE user_registration SET profile_id = ? WHERE id = ?',
        [profileId, u.id]
      );
      
      console.log(`Updated user ${u.id} (${u.religion}) profile_id to ${profileId}`);
    }

    console.log('All profile IDs updated to use user_registration sequence.');
    process.exit(0);

  } catch (error) {
    console.error('Error fixing profile IDs:', error);
    process.exit(1);
  }
};

fixProfileIds();
