import pool from '../../config/db.js';
import bcrypt from 'bcrypt';

export const updateUserSettings = async (req, res) => {
  const { profileId } = req.params;
  const { email, phone } = req.body;

  try {
    if (!profileId) {
      return res.status(400).json({ error: 'Profile ID is required' });
    }

    let updateFields = [];
    let updateValues = [];
    if (email) {
      updateFields.push('email_address = ?');
      updateValues.push(email);
    }
    if (phone) {
      updateFields.push('mobile_number = ?');
      updateValues.push(phone);
    }

    if (updateFields.length === 0) {
       return res.status(400).json({ error: 'No data to update' });
    }

    updateValues.push(profileId);
    
    const [result] = await pool.query(
      `UPDATE user_registration SET ${updateFields.join(', ')} WHERE profile_id = ?`,
      updateValues
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Error updating settings:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Email or phone number already in use' });
    }
    res.status(500).json({ error: 'Server error while updating settings' });
  }
};

export const resetPassword = async (req, res) => {
  const { profileId } = req.params;
  const { oldPassword, newPassword } = req.body;

  try {
    if (!profileId || !oldPassword || !newPassword) {
      return res.status(400).json({ error: 'Profile ID, old password, and new password are required' });
    }

    if (oldPassword === newPassword) {
      return res.status(400).json({ error: 'New password cannot be the same as the old password' });
    }

    // Fetch user
    const [users] = await pool.query(
      'SELECT id, password FROM user_registration WHERE profile_id = ?',
      [profileId]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = users[0];

    // Verify old password
    const validPassword = await bcrypt.compare(oldPassword, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Incorrect old password', field: 'oldPassword' });
    }

    // Hash new password
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password in DB
    await pool.query(
      'UPDATE user_registration SET password = ? WHERE profile_id = ?',
      [hashedNewPassword, profileId]
    );

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ error: 'Server error while resetting password' });
  }
};
