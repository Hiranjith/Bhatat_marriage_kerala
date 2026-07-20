import pool from '../../config/db.js';

// Create a new franchise
export const createFranchise = async (req, res) => {
  try {
    const { name, owner, location, mobile_number, email, pin_codes, status } = req.body;

    if (!name || !owner || !location || !mobile_number || !email || !pin_codes) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    // Generate franchise_id
    let franchise_id = 'FRN0001';
    const [latestFranchise] = await pool.execute('SELECT franchise_id FROM BM_Franchise ORDER BY id DESC LIMIT 1');
    
    if (latestFranchise.length > 0) {
      const lastId = latestFranchise[0].franchise_id; // e.g., "FRN0001"
      const numPart = parseInt(lastId.replace('FRN', ''), 10);
      const nextNum = numPart + 1;
      franchise_id = `FRN${String(nextNum).padStart(4, '0')}`;
    }

    const query = `
      INSERT INTO BM_Franchise 
      (franchise_id, name, owner, location, mobile_number, email, pin_codes, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      franchise_id,
      name,
      owner,
      location,
      mobile_number,
      email,
      JSON.stringify(pin_codes),
      status || 'active'
    ];

    const [result] = await pool.execute(query, values);
    res.status(201).json({ message: 'Franchise created successfully', id: result.insertId, franchise_id });
  } catch (error) {
    console.error('Error creating franchise:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Franchise ID already exists' });
    }
    res.status(500).json({ error: 'Failed to create franchise' });
  }
};

// Get all franchises
export const getAllFranchises = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM BM_Franchise ORDER BY franchise_id ASC');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching franchises:', error);
    res.status(500).json({ error: 'Failed to fetch franchises' });
  }
};

// Get franchise by ID
export const getFranchiseById = async (req, res) => {
  try {
    const { franchise_id } = req.params;
    const [rows] = await pool.execute('SELECT * FROM BM_Franchise WHERE franchise_id = ?', [franchise_id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Franchise not found' });
    }
    
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error fetching franchise:', error);
    res.status(500).json({ error: 'Failed to fetch franchise' });
  }
};

// Update franchise
export const updateFranchise = async (req, res) => {
  try {
    const { franchise_id } = req.params;
    const { name, owner, location, mobile_number, email, pin_codes, status } = req.body;

    const [existing] = await pool.execute('SELECT * FROM BM_Franchise WHERE franchise_id = ?', [franchise_id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Franchise not found' });
    }

    const query = `
      UPDATE BM_Franchise 
      SET name = ?, owner = ?, location = ?, mobile_number = ?, email = ?, pin_codes = ?, status = ?
      WHERE franchise_id = ?
    `;
    const values = [
      name || existing[0].name,
      owner || existing[0].owner,
      location || existing[0].location,
      mobile_number || existing[0].mobile_number,
      email || existing[0].email,
      pin_codes ? JSON.stringify(pin_codes) : existing[0].pin_codes,
      status || existing[0].status,
      franchise_id
    ];

    await pool.execute(query, values);
    res.status(200).json({ message: 'Franchise updated successfully' });
  } catch (error) {
    console.error('Error updating franchise:', error);
    res.status(500).json({ error: 'Failed to update franchise' });
  }
};

// Update just the pin codes (PATCH)
export const updateFranchisePincodes = async (req, res) => {
  try {
    const { franchise_id } = req.params;
    const { pin_codes } = req.body;

    if (!pin_codes || !Array.isArray(pin_codes)) {
      return res.status(400).json({ error: 'pin_codes must be an array' });
    }

    const query = `UPDATE BM_Franchise SET pin_codes = ? WHERE franchise_id = ?`;
    const [result] = await pool.execute(query, [JSON.stringify(pin_codes), franchise_id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Franchise not found' });
    }

    res.status(200).json({ message: 'Pin codes updated successfully' });
  } catch (error) {
    console.error('Error updating pin codes:', error);
    res.status(500).json({ error: 'Failed to update pin codes' });
  }
};

// Delete franchise
export const deleteFranchise = async (req, res) => {
  try {
    const { franchise_id } = req.params;
    
    const [result] = await pool.execute('DELETE FROM BM_Franchise WHERE franchise_id = ?', [franchise_id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Franchise not found' });
    }
    
    res.status(200).json({ message: 'Franchise deleted successfully' });
  } catch (error) {
    console.error('Error deleting franchise:', error);
    res.status(500).json({ error: 'Failed to delete franchise' });
  }
};
