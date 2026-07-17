import mysql from 'mysql2';
import 'dotenv/config';

const addPhotoColumns = async () => {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  const promisePool = pool.promise();

  try {
    console.log('Adding photo columns to user_registration table...');
    
    // Add columns if they do not exist (MariaDB 10.6+ supports IF NOT EXISTS for ADD COLUMN)
    // To be safe and compatible with older MySQL, we'll try to add them individually
    // and catch duplicate column errors.
    
    const columns = ['photo_1', 'photo_2', 'photo_3', 'photo_4'];
    
    for (const col of columns) {
      try {
        await promisePool.query(`ALTER TABLE user_registration ADD COLUMN ${col} VARCHAR(255) DEFAULT NULL;`);
        console.log(`Added column ${col}`);
      } catch (err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
          console.log(`Column ${col} already exists, skipping.`);
        } else {
          throw err;
        }
      }
    }

    console.log('Successfully completed adding photo columns.');

    process.exit(0);
  } catch (error) {
    console.error('Error adding photo columns:', error);
    process.exit(1);
  }
};

addPhotoColumns();
