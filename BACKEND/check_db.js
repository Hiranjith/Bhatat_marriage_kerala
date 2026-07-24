import pool from './config/db.js';

const test = async () => {
  const [res] = await pool.query('SELECT JSON_CONTAINS(\'["690816"]\', \'"690816"\') as r');
  console.log('JSON_CONTAINS Result:', res[0].r);
  
  const [f] = await pool.query('SELECT franchise_id FROM BM_Franchise WHERE JSON_CONTAINS(pin_codes, \'"000000"\')');
  console.log('Franchises for 000000:', f);

  // Backfill script
  console.log('Starting backfill...');
  const tables = ['hindus', 'christians', 'muslims', 'others'];
  let count = 0;
  for (const table of tables) {
    const [users] = await pool.query(`SELECT profile_id, pincode FROM ${table} WHERE pincode IS NOT NULL AND pincode != ''`);
    for (const user of users) {
      const [franchises] = await pool.query(
        `SELECT franchise_id FROM BM_Franchise WHERE JSON_CONTAINS(pin_codes, ?)`,
        [JSON.stringify(user.pincode)]
      );
      if (franchises.length === 0) {
        // check if already in requests
        const [existing] = await pool.query('SELECT * FROM bm_head_franchise_requests WHERE profile_id = ? AND status = "Unassigned"', [user.profile_id]);
        if (existing.length === 0) {
           const [latestReq] = await pool.query(`SELECT request_id FROM bm_head_franchise_requests ORDER BY id DESC LIMIT 1`);
           let nextReqId = 'REQ0001';
           if (latestReq.length > 0) {
              const num = parseInt(latestReq[0].request_id.replace('REQ', ''), 10);
              nextReqId = `REQ${String(num + 1).padStart(4, '0')}`;
           }
           await pool.query(
             `INSERT INTO bm_head_franchise_requests (request_id, profile_id, pincode, status) VALUES (?, ?, ?, 'Unassigned')`,
             [nextReqId, user.profile_id, user.pincode]
           );
           count++;
        }
      }
    }
  }
  console.log('Backfill complete. Inserted:', count);
  process.exit(0);
};

test();
