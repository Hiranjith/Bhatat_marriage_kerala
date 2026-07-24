import pool from '../../config/db.js';

// Get all head franchise requests
export const getRequests = async (req, res) => {
  try {
    const query = `
      SELECT 
        h.id, h.request_id, h.profile_id, h.pincode, h.status, h.assigned_franchise_id, 
        DATE_FORMAT(h.created_at, '%Y-%m-%d') as registeredOn,
        u.full_name as userName, u.mobile_number as phone, u.email_address as email,
        f.name as assigned_franchise_name
      FROM bm_head_franchise_requests h
      JOIN user_registration u ON h.profile_id = u.profile_id
      LEFT JOIN BM_Franchise f ON h.assigned_franchise_id = f.franchise_id
      ORDER BY h.created_at DESC
    `;
    const [rows] = await pool.execute(query);

    const formattedRows = rows.map(row => ({
      id: row.request_id, // For frontend compatibility
      requestId: row.request_id,
      userId: row.profile_id,
      userName: row.userName,
      pincode: row.pincode,
      phone: row.phone,
      email: row.email,
      registeredOn: row.registeredOn,
      status: row.status,
      assignedTo: row.assigned_franchise_name || row.assigned_franchise_id // name or fallback to ID
    }));

    res.status(200).json(formattedRows);
  } catch (error) {
    console.error('Error fetching head franchise requests:', error);
    res.status(500).json({ error: 'Failed to fetch head franchise requests' });
  }
};

// Assign a request to a franchise
export const assignRequest = async (req, res) => {
  try {
    const { request_id, franchise_id } = req.body;

    if (!request_id || !franchise_id) {
      return res.status(400).json({ error: 'Request ID and Franchise ID are required' });
    }

    // 1. Get request details
    const [requests] = await pool.execute(
      'SELECT * FROM bm_head_franchise_requests WHERE request_id = ? AND status = "Unassigned"',
      [request_id]
    );

    if (requests.length === 0) {
      return res.status(404).json({ error: 'Pending request not found' });
    }

    const request = requests[0];
    const pincode = request.pincode;

    // 2. Get franchise details
    const [franchises] = await pool.execute(
      'SELECT pin_codes, name FROM BM_Franchise WHERE franchise_id = ?',
      [franchise_id]
    );

    if (franchises.length === 0) {
      return res.status(404).json({ error: 'Franchise not found' });
    }

    const franchise = franchises[0];
    let currentPinCodes = franchise.pin_codes;
    if (typeof currentPinCodes === 'string') {
      try {
        currentPinCodes = JSON.parse(currentPinCodes);
      } catch (e) {
        currentPinCodes = [];
      }
    }
    if (!Array.isArray(currentPinCodes)) {
      currentPinCodes = [];
    }
    
    // Add pincode if not exists
    if (!currentPinCodes.includes(pincode)) {
      currentPinCodes.push(pincode);
      
      // Update franchise pin_codes
      await pool.execute(
        'UPDATE BM_Franchise SET pin_codes = ? WHERE franchise_id = ?',
        [JSON.stringify(currentPinCodes), franchise_id]
      );
    }

    // 3. Delete all pending requests for this pincode since it is now covered
    await pool.execute(
      'DELETE FROM bm_head_franchise_requests WHERE pincode = ?',
      [pincode]
    );

    res.status(200).json({ message: 'Request assigned successfully' });
  } catch (error) {
    console.error('Error assigning head franchise request:', error);
    res.status(500).json({ error: 'Failed to assign request' });
  }
};
