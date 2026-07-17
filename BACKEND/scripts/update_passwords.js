import mysql from 'mysql2';
import bcrypt from 'bcrypt';
import 'dotenv/config';

const updatePasswords = async () => {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  const promisePool = pool.promise();

  try {
    const saltRounds = 10;
    
    const users = [
      { email: 'rahul@example.com', name: 'rahul' },
      { email: 'anjali@example.com', name: 'anjali' },
      { email: 'kevin@example.com', name: 'kevin' },
      { email: 'sara@example.com', name: 'sara' },
      { email: 'tariq@example.com', name: 'mohammed' },
      { email: 'fathima@example.com', name: 'fathima' },
      { email: 'harpreet@example.com', name: 'harpreet' },
      { email: 'priya@example.com', name: 'priya' }
    ];

    for (const u of users) {
      const newPassword = `${u.name}123`;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

      await promisePool.query(
        `UPDATE user_registration SET password = ? WHERE email_address = ?`,
        [hashedPassword, u.email]
      );
      
      console.log(`Updated password for ${u.email} to ${newPassword}`);
    }

    console.log('All passwords updated successfully.');
    process.exit(0);

  } catch (error) {
    console.error('Error updating passwords:', error);
    process.exit(1);
  }
};

updatePasswords();
