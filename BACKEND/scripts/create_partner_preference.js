import mysql from 'mysql2/promise';
import 'dotenv/config';

const createTable = async () => {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  const query = `
    CREATE TABLE IF NOT EXISTS partner_preference (
      id bigint(20) NOT NULL AUTO_INCREMENT,
      profile_id varchar(20) NOT NULL,
      min_age int(11) DEFAULT NULL,
      max_age int(11) DEFAULT NULL,
      min_height varchar(50) DEFAULT NULL,
      max_height varchar(50) DEFAULT NULL,
      marital_status enum('Never Married', 'Second Marriage') DEFAULT NULL,
      mother_tongue varchar(100) DEFAULT NULL,
      religion varchar(100) DEFAULT NULL,
      caste varchar(100) DEFAULT NULL,
      education_level varchar(255) DEFAULT NULL,
      preferred_professions varchar(255) DEFAULT NULL,
      location_preferences varchar(255) DEFAULT NULL,
      created_at timestamp NULL DEFAULT current_timestamp(),
      updated_at timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
      PRIMARY KEY (id),
      UNIQUE KEY profile_id (profile_id),
      CONSTRAINT fk_partner_preference_profile_id FOREIGN KEY (profile_id) REFERENCES user_registration (profile_id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
  `;

  try {
    await pool.query(query);
    console.log('partner_preference table created successfully.');
  } catch (error) {
    console.error('Error creating table:', error);
  } finally {
    pool.end();
  }
};

createTable();
