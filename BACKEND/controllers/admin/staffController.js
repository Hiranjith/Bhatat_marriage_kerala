import pool from '../../config/db.js';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';

// Login Staff
export const loginStaff = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if staff exists with this email
    const [staffRows] = await pool.execute('SELECT * FROM BM_Staff_data WHERE email = ?', [email]);
    
    if (staffRows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const staff = staffRows[0];
    
    // Verify password using bcrypt
    const validPassword = await bcrypt.compare(password, staff.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    if (staff.account_status !== 'active') {
      return res.status(403).json({ error: 'Account is inactive or suspended' });
    }
    
    res.status(200).json({ message: 'Login successful', staff });
  } catch (error) {
    console.error('Error logging in staff:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Create a new staff
export const createStaff = async (req, res) => {
  try {
    const { name, role, franchise, email, phone_number, account_status } = req.body;

    if (!name || !role) {
      return res.status(400).json({ error: 'Name and role are required' });
    }

    if (email) {
      const [existingStaff] = await pool.execute('SELECT id FROM BM_Staff_data WHERE email = ?', [email]);
      if (existingStaff.length > 0) {
        return res.status(409).json({ error: 'A staff member with this email already exists.' });
      }
    }

    // Generate staff_id
    let staff_id = 'STF0001';
    const [latestStaff] = await pool.execute('SELECT staff_id FROM BM_Staff_data ORDER BY id DESC LIMIT 1');
    
    if (latestStaff.length > 0) {
      const lastId = latestStaff[0].staff_id; // e.g., "STF0001"
      const numPart = parseInt(lastId.replace('STF', ''), 10);
      const nextNum = numPart + 1;
      staff_id = `STF${String(nextNum).padStart(4, '0')}`;
    }

    // Generate password: name without spaces + last 4 digits of staff_id
    const sanitizedName = name.replace(/\s+/g, '');
    const plainPassword = `${sanitizedName}${staff_id.slice(-4)}`;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

    const query = `
      INSERT INTO BM_Staff_data 
      (staff_id, name, role, franchise, email, phone_number, account_status, password) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await pool.execute(query, [
      staff_id, 
      name, 
      role, 
      franchise || null, 
      email || null, 
      phone_number || null, 
      account_status || 'active',
      hashedPassword
    ]);

    // Send Email with generated password
    if (email && process.env.SMTP_USER && process.env.SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      const mailOptions = {
        from: process.env.SMTP_USER,
        to: email,
        subject: 'Welcome to Bharat Marriage - Staff Account',
        text: `Dear ${name},\n\nYour staff account for the Bharat Marriage Admin Portal has been successfully created.\n\nYour temporary password is: ${plainPassword}\n\nPlease use this password to log in at the staff portal.\n\nBest regards,\nThe Bharat Marriage Team`
      };

      try {
        await transporter.sendMail(mailOptions);
      } catch (emailError) {
        console.error('Failed to send staff welcome email:', emailError);
      }
    } else {
      console.warn('SMTP credentials missing or email not provided. Welcome email not sent.');
    }

    res.status(201).json({ message: 'Staff created successfully', staff_id });
  } catch (error) {
    console.error('Error creating staff:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all staff
export const getAllStaff = async (req, res) => {
  try {
    const [staffs] = await pool.execute('SELECT * FROM BM_Staff_data ORDER BY id DESC');
    res.status(200).json(staffs);
  } catch (error) {
    console.error('Error fetching staff:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get a single staff by ID
export const getStaffById = async (req, res) => {
  try {
    const { id } = req.params;
    const [staff] = await pool.execute('SELECT * FROM BM_Staff_data WHERE staff_id = ?', [id]);
    
    if (staff.length === 0) {
      return res.status(404).json({ error: 'Staff not found' });
    }
    
    res.status(200).json(staff[0]);
  } catch (error) {
    console.error('Error fetching staff:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update a staff
export const updateStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, franchise, email, phone_number, account_status } = req.body;

    const [existingStaff] = await pool.execute('SELECT * FROM BM_Staff_data WHERE staff_id = ?', [id]);
    if (existingStaff.length === 0) {
      return res.status(404).json({ error: 'Staff not found' });
    }

    const query = `
      UPDATE BM_Staff_data 
      SET name = ?, role = ?, franchise = ?, email = ?, phone_number = ?, account_status = ? 
      WHERE staff_id = ?
    `;

    await pool.execute(query, [
      name || existingStaff[0].name,
      role || existingStaff[0].role,
      franchise !== undefined ? franchise : existingStaff[0].franchise,
      email !== undefined ? email : existingStaff[0].email,
      phone_number !== undefined ? phone_number : existingStaff[0].phone_number,
      account_status || existingStaff[0].account_status,
      id
    ]);

    res.status(200).json({ message: 'Staff updated successfully' });
  } catch (error) {
    console.error('Error updating staff:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a staff
export const deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.execute('DELETE FROM BM_Staff_data WHERE staff_id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Staff not found' });
    }
    
    res.status(200).json({ message: 'Staff deleted successfully' });
  } catch (error) {
    console.error('Error deleting staff:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
