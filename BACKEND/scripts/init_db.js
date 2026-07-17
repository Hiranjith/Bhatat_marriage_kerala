import mysql from 'mysql2';
import 'dotenv/config';

const initDB = async () => {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    // Database name is excluded so we can create it if missing
    waitForConnections: true,
    connectionLimit: 50, // Increased for performance scaling
    queueLimit: 0
  });

  const promisePool = pool.promise();

  try {
    console.log('Connecting to MariaDB...');
    
    // Create the database if it doesn't exist
    await promisePool.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);
    console.log(`Database '${process.env.DB_NAME}' checked/created.`);

    // Use the newly created/existing database
    await promisePool.query(`USE \`${process.env.DB_NAME}\`;`);

    // Create optimized user_registration table
    // We use ENUMs for finite lists to save space, and indexes for fast searching.
    const createUsersTableQuery = `
      CREATE TABLE IF NOT EXISTS user_registration (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        profile_id VARCHAR(20) UNIQUE,
        full_name VARCHAR(255) NOT NULL,
        country_code VARCHAR(10) DEFAULT '+91',
        mobile_number VARCHAR(20) NOT NULL,
        email_address VARCHAR(255) UNIQUE NOT NULL,
        religion ENUM('Hindu', 'Christian', 'Muslim', 'Sikh', 'Other') NOT NULL,
        dob DATE NOT NULL,
        gender ENUM('Male', 'Female', 'Other') NOT NULL,
        password VARCHAR(255) NOT NULL,
        refresh_token VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_mobile (mobile_number),
        INDEX idx_religion_gender (religion, gender),
        INDEX idx_dob (dob)
      );
    `;
    
    await promisePool.query(createUsersTableQuery);
    console.log('user_registration table checked/created successfully with optimizations.');

    // Create religion-specific tables
    const createHindusTableQuery = `
      CREATE TABLE IF NOT EXISTS hindus (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        profile_id VARCHAR(20) UNIQUE NOT NULL,
        profile_created_for ENUM('Myself', 'Son', 'Daughter', 'Brother', 'Sister', 'Relative', 'Friend'),
        name VARCHAR(255),
        about_me TEXT,
        gender VARCHAR(50),
        age INT,
        height VARCHAR(50),
        marital_status VARCHAR(100),
        place VARCHAR(255),
        country VARCHAR(100),
        state VARCHAR(100),
        district VARCHAR(100),
        education VARCHAR(255),
        profession VARCHAR(255),
        employment_country VARCHAR(100),
        career_information TEXT,
        fathers_name VARCHAR(100),
        fathers_job VARCHAR(100),
        mothers_name VARCHAR(100),
        mothers_job VARCHAR(100),
        sibling_details TEXT,
        age_of_father INT,
        age_of_mother INT,
        date_of_birth DATE,
        date_of_birth_malayalam VARCHAR(100),
        birth_time TIME,
        nakshatra VARCHAR(100),
        rasi VARCHAR(100),
        horoscope_information TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (profile_id) REFERENCES user_registration(profile_id) ON DELETE CASCADE
      );
    `;
    await promisePool.query(createHindusTableQuery);
    console.log('hindus table checked/created successfully.');

    const createChristiansTableQuery = `
      CREATE TABLE IF NOT EXISTS christians (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        profile_id VARCHAR(20) UNIQUE NOT NULL,
        profile_created_for ENUM('Myself', 'Son', 'Daughter', 'Brother', 'Sister', 'Relative', 'Friend'),
        name VARCHAR(255),
        about_me TEXT,
        gender VARCHAR(50),
        age INT,
        height VARCHAR(50),
        marital_status VARCHAR(100),
        place VARCHAR(255),
        country VARCHAR(100),
        state VARCHAR(100),
        district VARCHAR(100),
        education VARCHAR(255),
        profession VARCHAR(255),
        employment_country VARCHAR(100),
        career_information TEXT,
        fathers_name VARCHAR(100),
        fathers_job VARCHAR(100),
        mothers_name VARCHAR(100),
        mothers_job VARCHAR(100),
        sibling_details TEXT,
        age_of_father INT,
        age_of_mother INT,
        date_of_birth DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (profile_id) REFERENCES user_registration(profile_id) ON DELETE CASCADE
      );
    `;
    await promisePool.query(createChristiansTableQuery);
    console.log('christians table checked/created successfully.');

    const createMuslimsTableQuery = `
      CREATE TABLE IF NOT EXISTS muslims (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        profile_id VARCHAR(20) UNIQUE NOT NULL,
        profile_created_for ENUM('Myself', 'Son', 'Daughter', 'Brother', 'Sister', 'Relative', 'Friend'),
        name VARCHAR(255),
        about_me TEXT,
        gender VARCHAR(50),
        age INT,
        height VARCHAR(50),
        marital_status VARCHAR(100),
        place VARCHAR(255),
        country VARCHAR(100),
        state VARCHAR(100),
        district VARCHAR(100),
        education VARCHAR(255),
        profession VARCHAR(255),
        employment_country VARCHAR(100),
        career_information TEXT,
        fathers_name VARCHAR(100),
        fathers_job VARCHAR(100),
        mothers_name VARCHAR(100),
        mothers_job VARCHAR(100),
        sibling_details TEXT,
        age_of_father INT,
        age_of_mother INT,
        date_of_birth DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (profile_id) REFERENCES user_registration(profile_id) ON DELETE CASCADE
      );
    `;
    await promisePool.query(createMuslimsTableQuery);
    console.log('muslims table checked/created successfully.');

    const createOthersTableQuery = `
      CREATE TABLE IF NOT EXISTS others (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        profile_id VARCHAR(20) UNIQUE NOT NULL,
        profile_created_for ENUM('Myself', 'Son', 'Daughter', 'Brother', 'Sister', 'Relative', 'Friend'),
        name VARCHAR(255),
        about_me TEXT,
        gender VARCHAR(50),
        age INT,
        height VARCHAR(50),
        marital_status VARCHAR(100),
        place VARCHAR(255),
        country VARCHAR(100),
        state VARCHAR(100),
        district VARCHAR(100),
        education VARCHAR(255),
        profession VARCHAR(255),
        employment_country VARCHAR(100),
        career_information TEXT,
        fathers_name VARCHAR(100),
        fathers_job VARCHAR(100),
        mothers_name VARCHAR(100),
        mothers_job VARCHAR(100),
        sibling_details TEXT,
        age_of_father INT,
        age_of_mother INT,
        date_of_birth DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (profile_id) REFERENCES user_registration(profile_id) ON DELETE CASCADE
      );
    `;
    await promisePool.query(createOthersTableQuery);
    console.log('others table checked/created successfully.');

    console.log('Database initialization completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
};

initDB();
