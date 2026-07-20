import pool from '../../config/db.js';

export const getDashboardMetrics = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT COUNT(*) as totalUsers FROM user_registration');
    const totalUsers = rows[0].totalUsers;
    
    res.status(200).json({
      totalUsers,
      totalStaffs: 6,
      monthlyRevenue: '₹1.84L'
    });
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
};
