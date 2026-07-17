import mysql from 'mysql2';
import 'dotenv/config';

const migrateUserIdToProfileId = async () => {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  const promisePool = pool.promise();
  const tables = ['hindus', 'christians', 'muslims', 'others'];

  try {
    for (const table of tables) {
      // 1. Drop existing foreign key. We need to find the constraint name first.
      const [fks] = await promisePool.query(`
        SELECT CONSTRAINT_NAME 
        FROM information_schema.KEY_COLUMN_USAGE 
        WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = 'user_id' AND REFERENCED_TABLE_NAME = 'user_registration'
      `, [process.env.DB_NAME, table]);

      if (fks.length > 0) {
        const constraintName = fks[0].CONSTRAINT_NAME;
        await promisePool.query(`ALTER TABLE ${table} DROP FOREIGN KEY \`${constraintName}\``);
      }
      
      // Also drop the unique index on user_id if it exists
      try {
        await promisePool.query(`ALTER TABLE ${table} DROP INDEX user_id`);
      } catch(e) {
        // Index might not be named user_id, ignore if it doesn't exist
      }

      // 2. Add the new profile_id column
      try {
        await promisePool.query(`ALTER TABLE ${table} ADD COLUMN profile_id VARCHAR(20) UNIQUE AFTER id`);
      } catch (e) {
        if (e.code !== 'ER_DUP_FIELDNAME') throw e;
      }

      // 3. Populate the new profile_id column using user_id
      await promisePool.query(`
        UPDATE ${table} t
        JOIN user_registration u ON t.user_id = u.id
        SET t.profile_id = u.profile_id
      `);

      // 4. Drop the old user_id column
      await promisePool.query(`ALTER TABLE ${table} DROP COLUMN user_id`);

      // 5. Add the new foreign key
      await promisePool.query(`
        ALTER TABLE ${table}
        ADD CONSTRAINT fk_${table}_profile_id
        FOREIGN KEY (profile_id) REFERENCES user_registration(profile_id)
        ON DELETE CASCADE
      `);
      
      console.log(`Migrated table ${table} from user_id to profile_id`);
    }

    console.log('Migration completed successfully.');
    process.exit(0);

  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrateUserIdToProfileId();
