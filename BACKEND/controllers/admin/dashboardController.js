import pool from '../../config/db.js';

export const getDashboardMetrics = async (req, res) => {
  try {
    const { franchise_id } = req.query;

    let baseQuery = `
      SELECT 
        COUNT(*) as totalUsers,
        SUM(CASE WHEN UPPER(ur.status) = 'ACTIVE' OR ur.status IS NULL THEN 1 ELSE 0 END) as activeUsers,
        SUM(CASE WHEN UPPER(ur.status) = 'BLOCKED' THEN 1 ELSE 0 END) as blockedUsers,
        SUM(CASE WHEN UPPER(ur.status) = 'BANNED' THEN 1 ELSE 0 END) as bannedUsers,
        SUM(CASE WHEN UPPER(ur.status) = 'FREEZED' THEN 1 ELSE 0 END) as freezedUsers,
        SUM(CASE WHEN UPPER(ur.status) = 'REPORTED' THEN 1 ELSE 0 END) as reportedUsers
      FROM user_registration ur
    `;
    let queryParams = [];

    if (franchise_id) {
      baseQuery = `
        SELECT 
          COUNT(*) as totalUsers,
          SUM(CASE WHEN UPPER(ur.status) = 'ACTIVE' OR ur.status IS NULL THEN 1 ELSE 0 END) as activeUsers,
          SUM(CASE WHEN UPPER(ur.status) = 'BLOCKED' THEN 1 ELSE 0 END) as blockedUsers,
          SUM(CASE WHEN UPPER(ur.status) = 'BANNED' THEN 1 ELSE 0 END) as bannedUsers,
          SUM(CASE WHEN UPPER(ur.status) = 'FREEZED' THEN 1 ELSE 0 END) as freezedUsers,
          SUM(CASE WHEN UPPER(ur.status) = 'REPORTED' THEN 1 ELSE 0 END) as reportedUsers
        FROM user_registration ur
        LEFT JOIN hindus h ON ur.profile_id = h.profile_id
        LEFT JOIN christians c ON ur.profile_id = c.profile_id
        LEFT JOIN muslims m ON ur.profile_id = m.profile_id
        LEFT JOIN others o ON ur.profile_id = o.profile_id
        WHERE 1=1
      `;

      const [franchiseRows] = await pool.execute('SELECT pin_codes FROM BM_Franchise WHERE franchise_id = ?', [franchise_id]);
      if (franchiseRows.length > 0) {
        let pinCodes = franchiseRows[0].pin_codes;
        if (typeof pinCodes === 'string') {
          try { pinCodes = JSON.parse(pinCodes); } catch (e) { pinCodes = []; }
        }
        if (Array.isArray(pinCodes) && pinCodes.length > 0) {
          const placeholders = pinCodes.map(() => '?').join(',');
          baseQuery += ` AND COALESCE(h.pincode, c.pincode, m.pincode, o.pincode) IN (${placeholders})`;
          queryParams.push(...pinCodes);
        } else {
          baseQuery += ` AND 1=0`;
        }
      } else {
        baseQuery += ` AND 1=0`;
      }
    }

    const [rows] = await pool.execute(baseQuery, queryParams);
    
    const [staffRows] = await pool.execute('SELECT COUNT(*) as totalStaffs FROM BM_Staff_data');

    res.status(200).json({
      totalUsers: parseInt(rows[0].totalUsers) || 0,
      activeUsers: parseInt(rows[0].activeUsers) || 0,
      blockedUsers: parseInt(rows[0].blockedUsers) || 0,
      bannedUsers: parseInt(rows[0].bannedUsers) || 0,
      freezedUsers: parseInt(rows[0].freezedUsers) || 0,
      reportedUsers: parseInt(rows[0].reportedUsers) || 0,
      totalStaffs: parseInt(staffRows[0].totalStaffs) || 0,
      monthlyRevenue: '₹1.84L'
    });
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
};
