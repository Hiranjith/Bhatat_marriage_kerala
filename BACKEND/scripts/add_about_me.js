import mysql from 'mysql2';
import 'dotenv/config';

const addAboutMe = async () => {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  const promisePool = pool.promise();
  const tables = ['hindus', 'christians', 'muslims', 'others'];

  try {
    // 1. Add the column to each table
    for (const table of tables) {
      try {
        await promisePool.query(`ALTER TABLE ${table} ADD COLUMN about_me TEXT AFTER name`);
        console.log(`Added about_me column to ${table}`);
      } catch (error) {
        if (error.code === 'ER_DUP_FIELDNAME') {
          console.log(`Column about_me already exists in ${table}`);
        } else {
          throw error;
        }
      }
    }

    // 2. Add dummy data for existing users
    const updates = [
      { table: 'hindus', email: 'rahul@example.com', about: "I'm a software engineer based in Kochi. I enjoy traveling, reading, and exploring new technologies. Looking for a partner with similar interests." },
      { table: 'hindus', email: 'anjali@example.com', about: "I'm Anjali, an HR Manager working in Trivandrum. I value family traditions and seek a companion who is understanding, caring, and ambitious." },
      { table: 'christians', email: 'kevin@example.com', about: "I'm Kevin, currently working as an accountant in Kottayam. I love playing football and spending weekends with friends and family." },
      { table: 'christians', email: 'sara@example.com', about: "I'm a registered nurse working in the UK but originally from Thrissur. I have a passion for healthcare and love helping others." },
      { table: 'muslims', email: 'tariq@example.com', about: "I run my own business in the UAE. I'm a down-to-earth person who believes in balancing modern life with traditional values." },
      { table: 'muslims', email: 'fathima@example.com', about: "I'm a teacher by profession, living in Malappuram. I love baking, reading literature, and spending time with my family." },
      { table: 'others', email: 'harpreet@example.com', about: "I'm an engineer working in Canada. I'm adventurous and outgoing, and I'm looking for a partner who is open-minded and loves to travel." },
      { table: 'others', email: 'priya@example.com', about: "I am an architect based in Ernakulam. I have a deep interest in art, design, and culture. I am looking for a supportive and loving partner." }
    ];

    for (const update of updates) {
      // Find the user ID from email first
      const [users] = await promisePool.query('SELECT profile_id FROM user_registration WHERE email_address = ?', [update.email]);
      if (users.length > 0) {
        const profileId = users[0].profile_id;
        await promisePool.query(
          `UPDATE ${update.table} SET about_me = ? WHERE profile_id = ?`,
          [update.about, profileId]
        );
        console.log(`Updated about_me for ${update.email}`);
      }
    }

    console.log('About Me additions completed successfully.');
    process.exit(0);

  } catch (error) {
    console.error('Error adding about_me:', error);
    process.exit(1);
  }
};

addAboutMe();
