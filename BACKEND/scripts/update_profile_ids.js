import mysql from 'mysql2';
import 'dotenv/config';

const updateProfileIds = async () => {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  const promisePool = pool.promise();

  try {
    const updates = [
      { email: 'rahul@example.com', newProfileId: 'BKLH00000001' },
      { email: 'anjali@example.com', newProfileId: 'BKLH00000002' },
      { email: 'kevin@example.com', newProfileId: 'BKLC00000001' },
      { email: 'sara@example.com', newProfileId: 'BKLC00000002' },
      { email: 'tariq@example.com', newProfileId: 'BKLM00000001' },
      { email: 'fathima@example.com', newProfileId: 'BKLM00000002' },
      { email: 'harpreet@example.com', newProfileId: 'BKLS00000001' },
      { email: 'priya@example.com', newProfileId: 'BKLO00000001' }
    ];

    for (const u of updates) { 
      await promisePool.query(
        `UPDATE user_registration SET profile_id = ? WHERE email_address = ?`,
        [u.newProfileId, u.email]
      );
      console.log(`Updated profile_id for ${u.email} to ${u.newProfileId}`);
    }

    console.log('All profile IDs updated successfully.');
    process.exit(0);

  } catch (error) {
    console.error('Error updating profile IDs:', error);
    process.exit(1);
  }
};

updateProfileIds();
