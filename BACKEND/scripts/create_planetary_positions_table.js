import mysql from 'mysql2';
import 'dotenv/config';

const createPlanetaryPositionsTable = async () => {
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
    console.log('Connecting to database...');
    
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS planetary_positions (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        profile_id VARCHAR(20) NOT NULL,
        chart_type ENUM('grahanila', 'navamsakam') NOT NULL,
        planet_name ENUM('Lagna', 'Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu') NOT NULL,
        house_number INT NOT NULL CHECK (house_number BETWEEN 1 AND 12),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (profile_id) REFERENCES user_registration(profile_id) ON DELETE CASCADE,
        UNIQUE KEY unique_planet_per_chart (profile_id, chart_type, planet_name)
      );
    `;
    
    await promisePool.query(createTableQuery);
    console.log('planetary_positions table created successfully.');
    
    process.exit(0);
  } catch (error) {
    console.error('Failed to create planetary_positions table:', error);
    process.exit(1);
  }
};

createPlanetaryPositionsTable();
