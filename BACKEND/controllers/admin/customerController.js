import pool from '../../config/db.js';

export const getCustomers = async (req, res) => {
  try {
    const { search, gender, status, page = 1, limit = 10 } = req.query;

    let baseSelect = `
      SELECT 
        ur.profile_id, ur.full_name, ur.gender, ur.religion, ur.dob, ur.photo_1,
        ur.verification, ur.plan, ur.status, ur.is_online, ur.last_seen,
        (ur.refresh_token IS NOT NULL AND ur.refresh_token != '') AS has_active_session,
        COALESCE(h.height, c.height, m.height, o.height) AS height,
        COALESCE(h.education, c.education, m.education, o.education) AS education,
        COALESCE(h.profession, c.profession, m.profession, o.profession) AS profession,
        COALESCE(h.place, c.place, m.place, o.place) AS place,
        COALESCE(h.district, c.district, m.district, o.district) AS district,
        COALESCE(h.state, c.state, m.state, o.state) AS state
      FROM user_registration ur
      LEFT JOIN hindus h ON ur.profile_id = h.profile_id
      LEFT JOIN christians c ON ur.profile_id = c.profile_id
      LEFT JOIN muslims m ON ur.profile_id = m.profile_id
      LEFT JOIN others o ON ur.profile_id = o.profile_id
      WHERE 1=1
    `;

    let countSelect = `
      SELECT COUNT(*) as total 
      FROM user_registration ur
      LEFT JOIN hindus h ON ur.profile_id = h.profile_id
      LEFT JOIN christians c ON ur.profile_id = c.profile_id
      LEFT JOIN muslims m ON ur.profile_id = m.profile_id
      LEFT JOIN others o ON ur.profile_id = o.profile_id
      WHERE 1=1
    `;

    let filters = '';
    const queryParams = [];

    // Search filter: matches profile_id, full_name, profession, place, district, or state
    if (search) {
      filters += ` AND (
        ur.profile_id LIKE ? 
        OR ur.full_name LIKE ?
        OR COALESCE(h.profession, c.profession, m.profession, o.profession) LIKE ?
        OR COALESCE(h.place, c.place, m.place, o.place) LIKE ?
        OR COALESCE(h.district, c.district, m.district, o.district) LIKE ?
        OR COALESCE(h.state, c.state, m.state, o.state) LIKE ?
      )`;
      const searchTerm = `%${search}%`;
      // Push the search term 6 times for the 6 placeholders
      queryParams.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
    }

    // Gender filter
    if (gender && gender !== 'All Genders') {
      if (gender.includes('Female')) {
        filters += ` AND ur.gender = 'Female'`;
      } else if (gender.includes('Male')) {
        filters += ` AND ur.gender = 'Male'`;
      }
    }

    // Status filter
    if (status && status !== 'All Profiles') {
      if (status === 'Reported Accounts') {
        filters += ` AND ur.status = 'REPORTED'`;
      } else {
        filters += ` AND ur.status = ?`;
        queryParams.push(status.toUpperCase()); // ACTIVE, BLOCKED, BANNED
      }
    }

    // Pagination for the main query
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const pagination = ` ORDER BY ur.created_at DESC LIMIT ? OFFSET ?`;
    
    // Execute both queries
    const [customers] = await pool.execute(baseSelect + filters + pagination, [...queryParams, parseInt(limit), offset]);
    const [countResult] = await pool.execute(countSelect + filters, queryParams);
    const total = countResult[0].total;

    res.status(200).json({
      customers,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
};

export const forceLogout = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Invalidate the session by clearing refresh_token and setting is_online to FALSE
    const [result] = await pool.execute(
      `UPDATE user_registration SET refresh_token = NULL, is_online = FALSE WHERE profile_id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User forcefully logged out successfully' });
  } catch (error) {
    console.error('Error force logging out user:', error);
    res.status(500).json({ error: 'Failed to force logout user' });
  }
};

export const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { verification, status } = req.body;
    
    let updateQuery = 'UPDATE user_registration SET ';
    const params = [];
    
    if (verification !== undefined) {
      updateQuery += 'verification = ?';
      params.push(verification ? 'VERIFIED' : 'UNVERIFIED');
    }
    
    if (status !== undefined) {
      if (params.length > 0) updateQuery += ', ';
      updateQuery += 'status = ?';
      params.push(status.toUpperCase());
    }
    
    if (params.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    
    updateQuery += ' WHERE profile_id = ?';
    params.push(id);
    
    const [result] = await pool.execute(updateQuery, params);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.status(200).json({ message: 'Customer updated successfully' });
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({ error: 'Failed to update customer' });
  }
};
