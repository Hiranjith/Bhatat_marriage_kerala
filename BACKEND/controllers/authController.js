import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';
import nodemailer from 'nodemailer';

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user.id, email: user.email_address },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

// Helper to convert "18 Oct 1994" to "1994-10-18" for MySQL DATE column
const formatDateForDB = (dobString) => {
  if (!dobString) return null;
  const months = {
    Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
    Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12'
  };
  const parts = dobString.split(' ');
  if (parts.length === 3) {
    const [day, monthStr, year] = parts;
    const month = months[monthStr];
    if (month) {
      return `${year}-${month}-${day.padStart(2, '0')}`;
    }
  }
  // Fallback to JS Date if format is unexpected
  const d = new Date(dobString);
  if (!isNaN(d.getTime())) {
    return d.toISOString().split('T')[0];
  }
  return dobString;
};

export const register = async (req, res) => {
  const { full_name, country_code, mobile_number, email_address, religion, district, dob, gender } = req.body;

  try {
    const formattedDob = formatDateForDB(dob);
    // 1. Check if user already exists
    const [existingUsers] = await pool.query(
      'SELECT id FROM user_registration WHERE email_address = ? OR mobile_number = ?',
      [email_address, mobile_number]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({ error: 'User with this email or mobile number already exists.' });
    }

    // 2. Generate and Hash password
    const namePrefix = full_name.replace(/\s+/g, '').substring(0, 4);
    const year = dob ? dob.split(' ').pop() : '';
    const plainPassword = `${namePrefix}${year}`;

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

    // 3. Insert new user
    const insertQuery = `
      INSERT INTO user_registration 
      (full_name, country_code, mobile_number, email_address, religion, district, dob, gender, password)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [full_name, country_code || '+91', mobile_number, email_address, religion, district, formattedDob, gender, hashedPassword];

    const [result] = await pool.query(insertQuery, values);
    const userId = result.insertId;

    // Generate custom profile_id (e.g., BKLH08000000001)
    const stateCode = 'KL';
    let religionInitial = religion ? religion.charAt(0).toUpperCase() : 'T';
    if (religion === 'Other') {
      religionInitial = 'T';
    }
    
    let districtCode = '00';
    if (district) {
      const match = district.match(/^(\d{2})/);
      if (match) {
        districtCode = match[1];
      }
    }
    
    const paddedId = String(userId).padStart(9, '0');
    const profileId = `B${stateCode}${religionInitial}${districtCode}${paddedId}`;

    // 4. Update profile_id and refresh token in DB
    const { accessToken, refreshToken } = generateTokens({ id: userId, email_address });
    
    await pool.query(
      'UPDATE user_registration SET profile_id = ?, refresh_token = ? WHERE id = ?', 
      [profileId, refreshToken, userId]
    );

    // 5. Insert user into matching religion table
    let matchingTable = 'others';
    switch (religion) {
      case 'Hindu': matchingTable = 'hindus'; break;
      case 'Christian': matchingTable = 'christians'; break;
      case 'Muslim': matchingTable = 'muslims'; break;
    }
    
    let age = null;
    if (formattedDob) {
       const dobDate = new Date(formattedDob);
       const diff = Date.now() - dobDate.getTime();
       const ageDate = new Date(diff); 
       age = Math.abs(ageDate.getUTCFullYear() - 1970);
    }
    
    await pool.query(
      `INSERT INTO ${matchingTable} (profile_id, name, gender, age) VALUES (?, ?, ?, ?)`,
      [profileId, full_name, gender, age]
    );

    // 6. Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // 7. Send Welcome Email with generated password
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      const mailOptions = {
        from: process.env.SMTP_USER,
        to: email_address,
        subject: 'Welcome! Your Account Password',
        text: `Hello ${full_name},\n\nYour account has been successfully created.\n\nYour generated password is: ${plainPassword}\n\nYou can use this password to log in. We recommend updating your password after your first login.\n\nBest Regards,\nBharat Marriage`
      };

      try {
        await transporter.sendMail(mailOptions);
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
      }
    } else {
      console.warn('SMTP credentials not provided. Welcome email not sent.');
    }

    res.status(201).json({
      message: 'User registered successfully',
      accessToken,
      user: { id: userId, profile_id: profileId, full_name, email_address, mobile_number }
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
};

export const login = async (req, res) => {
  const identifier = req.body.identifier || req.body.email_address || req.body.mobile_number;
  const { password } = req.body;

  try {
    if (!identifier || !password) {
      return res.status(400).json({ error: 'Email or Mobile number and password are required' });
    }

    // 1. Find user (check both email_address and mobile_number)
    const [users] = await pool.query(
      'SELECT * FROM user_registration WHERE email_address = ? OR mobile_number = ?', 
      [identifier, identifier]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];

    // 2. Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 3. Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // 4. Update refresh token in DB
    await pool.query('UPDATE user_registration SET refresh_token = ? WHERE id = ?', [refreshToken, user.id]);

    // 5. Set refresh token cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(200).json({
      message: 'Login successful',
      accessToken,
      user: {
        id: user.id,
        profile_id: user.profile_id,
        full_name: user.full_name,
        email_address: user.email_address,
        mobile_number: user.mobile_number,
        religion: user.religion,
        gender: user.gender,
        created_at: user.created_at,
        photo_1: user.photo_1
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
};

export const refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) return res.status(401).json({ error: 'Refresh token not found' });

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    // Check if token matches the one in DB
    const [users] = await pool.query('SELECT * FROM user_registration WHERE id = ? AND refresh_token = ?', [decoded.id, token]);
    
    if (users.length === 0) {
      return res.status(403).json({ error: 'Invalid refresh token' });
    }

    const user = users[0];
    
    // Generate new tokens
    const tokens = generateTokens(user);

    // Update refresh token in DB
    await pool.query('UPDATE user_registration SET refresh_token = ? WHERE id = ?', [tokens.refreshToken, user.id]);

    // Set new refresh token cookie
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ accessToken: tokens.accessToken });
  } catch (error) {
    console.error('Refresh Token Error:', error);
    res.status(403).json({ error: 'Invalid or expired refresh token' });
  }
};

export const getMe = async (req, res) => {
  // If the request reaches here, it means verifyUserSession middleware passed
  // So the user has a valid access token and a valid refresh token in DB.
  res.status(200).json({ valid: true, user: req.user });
};

export const logout = async (req, res) => {
  const token = req.cookies.refreshToken;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET, { ignoreExpiration: true });
      // Remove refresh token from DB
      await pool.query('UPDATE user_registration SET refresh_token = NULL WHERE id = ?', [decoded.id]);
    } catch (err) {
      console.error('Logout error clearing token from DB:', err);
    }
  }

  // Clear cookie
  res.clearCookie('refreshToken');
  res.status(200).json({ message: 'Logged out successfully' });
};

export const forgotPassword = async (req, res) => {
  const { email_address } = req.body;

  try {
    if (!email_address) {
      return res.status(400).json({ error: 'Email address is required' });
    }

    // 1. Find user by email
    const [users] = await pool.query(
      'SELECT * FROM user_registration WHERE email_address = ?', 
      [email_address]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'Account not found.' });
    }

    const user = users[0];

    // 2. Generate a new random password
    const generateRandomPassword = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
      let pass = '';
      for (let i = 0; i < 8; i++) {
        pass += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return pass;
    };
    
    const newPassword = generateRandomPassword();

    // 3. Hash the new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // 4. Update the DB
    await pool.query(
      'UPDATE user_registration SET password = ? WHERE id = ?', 
      [hashedPassword, user.id]
    );

    // 5. Send Email
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      const mailOptions = {
        from: process.env.SMTP_USER,
        to: email_address,
        subject: 'Password Reset - Bharat Marriage',
        text: `Dear ${user.full_name},\n\nWe received a request to reset your password for your Bharat Marriage account.\n\nYour temporary password is: ${newPassword}\n\nFor your security, please log in to your account and change this password immediately.\n\nIf you did not request this password reset, please ignore this email or contact our support team immediately.\n\nBest regards,\nThe Bharat Marriage Team`
      };

      try {
        await transporter.sendMail(mailOptions);
        return res.status(200).json({ message: 'If that email is in our system, we have sent a password to it.' });
      } catch (emailError) {
        console.error('Failed to send reset email:', emailError);
        return res.status(500).json({ error: 'Failed to send email. Please try again later.' });
      }
    } else {
      console.warn('SMTP credentials not provided. Reset email not sent.');
      return res.status(500).json({ error: 'Email service is not configured.' });
    }

  } catch (error) {
    console.error('Forgot Password Error:', error);
    res.status(500).json({ error: 'Server error during password reset' });
  }
};
