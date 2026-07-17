import mysql from 'mysql2';
import 'dotenv/config';

const alterPlanetaryPositionsTable = async () => {
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
    console.log('Connecting to database to optimize table...');
    
    // Adding an index that will massively speed up partner matching algorithms 
    // (e.g. searching for people with Mars in the 7th house for Kuja Dosha matching)
    const alterTableQuery = `
      ALTER TABLE planetary_positions 
      ADD INDEX idx_matching_search (chart_type, planet_name, house_number);
    `;
    
    await promisePool.query(alterTableQuery);
    console.log('Optimized planetary_positions table with a search index for 10M+ users.');
    
    process.exit(0);
  } catch (error) {
    // If it already exists, it will throw an error, which is fine
    console.error('Failed to alter table (it might already have the index):', error.message);
    process.exit(1);
  }
};

alterPlanetaryPositionsTable();
