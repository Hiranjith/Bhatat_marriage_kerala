import pool from '../config/db.js';
import * as kollavarshamPkg from 'kollavarsham';
import fs from 'fs';
import path from 'path';

const Kollavarsham = kollavarshamPkg.Kollavarsham || kollavarshamPkg.default;
const kollavarsham = new Kollavarsham();

export const getUserDetailsByProfileId = async (req, res) => {
  const { profileId } = req.params;

  try {
    if (!profileId) {
      return res.status(400).json({ error: 'Profile ID is required' });
    }

    // 1. Get base user details and identify religion
    const [users] = await pool.query(
      'SELECT id, profile_id, full_name, country_code, mobile_number, email_address, religion, dob, gender, created_at FROM user_registration WHERE profile_id = ?',
      [profileId]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = users[0];
    const userId = user.id;
    let matchingTable = 'others'; // default

    // Determine the matching table based on religion
    switch (user.religion) {
      case 'Hindu':
        matchingTable = 'hindus';
        break;
      case 'Christian':
        matchingTable = 'christians';
        break;
      case 'Muslim':
        matchingTable = 'muslims';
        break;
      case 'Sikh':
      case 'Other':
      default:
        matchingTable = 'others';
        break;
    }

    // 2. Fetch specific profile details from the matching table
    const [profileDetails] = await pool.query(
      `SELECT * FROM ${matchingTable} WHERE profile_id = ?`,
      [profileId]
    );

    const profile = profileDetails.length > 0 ? profileDetails[0] : null;

    if (!profile) {
      return res.status(404).json({ error: 'User details not found in the matching table' });
    }

    // Pass the dob and gender from user_registration if they are missing in the religion table
    if (!profile.date_of_birth) {
      profile.date_of_birth = user.dob;
    }
    
    if (!profile.date_of_birth_malayalam && profile.date_of_birth) {
      const d = new Date(profile.date_of_birth);
      if (!isNaN(d.getTime())) {
        const result = kollavarsham.fromGregorianDate(d);
        profile.date_of_birth_malayalam = result.toString ? result.toString() : result.year + ' ' + result.month + ' ' + result.date;
      }
    }
    if (!profile.gender) {
      profile.gender = user.gender;
    }

    res.status(200).json({
      message: 'User details fetched successfully',
      user: profile
    });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ error: 'Server error while fetching user details' });
  }
};

export const updateUserDetailsByProfileId = async (req, res) => {
  const { profileId } = req.params;
  const updateData = req.body;

  try {
    const [users] = await pool.query(
      'SELECT religion FROM user_registration WHERE profile_id = ?',
      [profileId]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = users[0];
    let matchingTable;
    switch (user.religion) {
      case 'Hindu': matchingTable = 'hindus'; break;
      case 'Christian': matchingTable = 'christians'; break;
      case 'Muslim': matchingTable = 'muslims'; break;
      case 'Sikh':
      case 'Other':
      default: matchingTable = 'others'; break;
    }

    // Process starRasi
    let nakshatra = null;
    let rasi = null;
    if (updateData.starRasi) {
      const parts = updateData.starRasi.split('/').map(s => s.trim());
      nakshatra = parts[0] || null;
      rasi = parts.length > 1 ? parts[1] : null;
    }

    // Process date_of_birth
    let dob = null;
    let dobMalayalam = null;
    if (updateData.dobEnglish) {
      const d = new Date(updateData.dobEnglish);
      if (!isNaN(d.getTime())) {
        dob = d.toISOString().split('T')[0];
        const result = kollavarsham.fromGregorianDate(d);
        dobMalayalam = result.toString ? result.toString() : result.year + ' ' + result.month + ' ' + result.date;

        // Automatically update age
        const today = new Date();
        let age = today.getFullYear() - d.getFullYear();
        const m = today.getMonth() - d.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < d.getDate())) {
          age--;
        }
        updateData.age = age;
      }
    }

    let query = `
      UPDATE ${matchingTable}
      SET 
        name = ?, gender = ?, age = ?, height = ?, marital_status = ?,
        profile_created_for = ?, education = ?, profession = ?,
        country = ?, state = ?, district = ?, place = ?,
        fathers_name = ?, fathers_job = ?, mothers_name = ?, mothers_job = ?,
        sibling_details = ?, about_me = ?, date_of_birth = COALESCE(?, date_of_birth)
    `;

    const values = [
      updateData.name || null,
      updateData.gender || null,
      updateData.age || null,
      updateData.height || null,
      updateData.maritalStatus || null,
      updateData.profileCreatedFor || null,
      updateData.education || null,
      updateData.profession || null,
      updateData.country || null,
      updateData.state || null,
      updateData.district || null,
      updateData.city || null,
      updateData.fathersName || null,
      updateData.fathersJob || null,
      updateData.mothersName || null,
      updateData.mothersJob || null,
      updateData.siblingDetails || null,
      updateData.aboutMe || null,
      dob
    ];

    if (matchingTable === 'hindus') {
      query += `, birth_time = ?, nakshatra = ?, rasi = ?, date_of_birth_malayalam = COALESCE(?, date_of_birth_malayalam) `;
      values.push(
        updateData.birthTime || null,
        nakshatra,
        rasi,
        dobMalayalam
      );
    }

    query += ` WHERE profile_id = ?`;
    values.push(profileId);

    const [result] = await pool.query(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Profile not found in matching table' });
    }

    // Also update fields in user_registration
    if (updateData.name || dob) {
      let updateFields = [];
      let updateValues = [];
      if (updateData.name) {
        updateFields.push('full_name = ?');
        updateValues.push(updateData.name);
      }
      if (dob) {
        updateFields.push('dob = ?');
        updateValues.push(dob);
      }
      updateValues.push(profileId);
      
      await pool.query(
        `UPDATE user_registration SET ${updateFields.join(', ')} WHERE profile_id = ?`,
        updateValues
      );
    }

    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getPlanetaryPositions = async (req, res) => {
  const { profileId } = req.params;
  
  try {
    if (!profileId) {
      return res.status(400).json({ error: 'Profile ID is required' });
    }
    
    const [positions] = await pool.query(
      'SELECT chart_type, planet_name, house_number FROM planetary_positions WHERE profile_id = ?',
      [profileId]
    );
    
    res.status(200).json({
      message: 'Planetary positions fetched successfully',
      positions
    });
  } catch (error) {
     console.error('Error fetching planetary positions:', error);
     res.status(500).json({ error: 'Server error while fetching planetary positions' });
  }
};

export const updatePlanetaryPositions = async (req, res) => {
  const { profileId } = req.params;
  const { positions } = req.body;

  try {
    if (!profileId) {
      return res.status(400).json({ error: 'Profile ID is required' });
    }

    if (!Array.isArray(positions)) {
      return res.status(400).json({ error: 'Positions must be an array' });
    }

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      await connection.query('DELETE FROM planetary_positions WHERE profile_id = ?', [profileId]);

      if (positions.length > 0) {
        const insertQuery = `
          INSERT INTO planetary_positions (profile_id, chart_type, planet_name, house_number) 
          VALUES ?
        `;
        const values = positions.map(pos => [
          profileId,
          pos.chart_type,
          pos.planet_name,
          pos.house_number
        ]);
        
        await connection.query(insertQuery, [values]);
      }

      await connection.commit();
      res.status(200).json({ message: 'Planetary positions updated successfully' });
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error updating planetary positions:', error);
    res.status(500).json({ error: 'Server error while updating planetary positions' });
  }
};

export const getUserPhotos = async (req, res) => {
  const { profileId } = req.params;
  try {
    const [users] = await pool.query(
      'SELECT photo_1, photo_2, photo_3, photo_4 FROM user_registration WHERE profile_id = ?',
      [profileId]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      photos: users[0]
    });
  } catch (error) {
    console.error('Error fetching photos:', error);
    res.status(500).json({ error: 'Server error fetching photos' });
  }
};

const deleteOldPhotoFile = (oldUrl) => {
  if (oldUrl && oldUrl.includes('/uploads/')) {
    try {
      const filename = oldUrl.split('/uploads/')[1];
      const filepath = path.resolve(process.cwd(), 'uploads', filename);
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
    } catch (err) {
      console.error('Failed to delete old photo file:', err);
    }
  }
};

export const uploadUserPhoto = async (req, res) => {
  const { profileId } = req.params;
  const { slot } = req.body; // e.g. "photo_1", "photo_2"

  if (!['photo_1', 'photo_2', 'photo_3', 'photo_4'].includes(slot)) {
    return res.status(400).json({ error: 'Invalid photo slot' });
  }

  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    // 1. Check for existing photo to delete it
    const [existing] = await pool.query(
      `SELECT ${slot} FROM user_registration WHERE profile_id = ?`,
      [profileId]
    );
    const oldUrl = existing.length > 0 ? existing[0][slot] : null;

    // 2. Generate the URL for the frontend to access
    const photoUrl = `http://localhost:5000/uploads/${req.file.filename}`;

    // 3. Update the database
    await pool.query(
      `UPDATE user_registration SET ${slot} = ? WHERE profile_id = ?`,
      [photoUrl, profileId]
    );

    // 4. Delete the old file from the system if it exists
    deleteOldPhotoFile(oldUrl);

    res.status(200).json({
      message: 'Photo uploaded successfully',
      photoUrl,
      slot
    });
  } catch (error) {
    console.error('Error uploading photo:', error);
    res.status(500).json({ error: 'Server error uploading photo' });
  }
};

export const deleteUserPhoto = async (req, res) => {
  const { profileId, slot } = req.params;

  if (!['photo_1', 'photo_2', 'photo_3', 'photo_4'].includes(slot)) {
    return res.status(400).json({ error: 'Invalid photo slot' });
  }

  try {
    // 1. Fetch the existing URL so we can delete the file
    const [existing] = await pool.query(
      `SELECT ${slot} FROM user_registration WHERE profile_id = ?`,
      [profileId]
    );
    const oldUrl = existing.length > 0 ? existing[0][slot] : null;

    // 2. Set the column to NULL in the database
    await pool.query(
      `UPDATE user_registration SET ${slot} = NULL WHERE profile_id = ?`,
      [profileId]
    );

    // 3. Delete the file from the system
    deleteOldPhotoFile(oldUrl);

    res.status(200).json({
      message: 'Photo deleted successfully',
      slot
    });
  } catch (error) {
    console.error('Error deleting photo:', error);
    res.status(500).json({ error: 'Server error deleting photo' });
  }
};

export const getPartnerPreferences = async (req, res) => {
  const { profileId } = req.params;
  
  try {
    if (!profileId) {
      return res.status(400).json({ error: 'Profile ID is required' });
    }
    
    const [preferences] = await pool.query(
      'SELECT * FROM partner_preference WHERE profile_id = ?',
      [profileId]
    );
    
    res.status(200).json({
      message: 'Partner preferences fetched successfully',
      preferences: preferences.length > 0 ? preferences[0] : null
    });
  } catch (error) {
     console.error('Error fetching partner preferences:', error);
     res.status(500).json({ error: 'Server error while fetching partner preferences' });
  }
};

export const updatePartnerPreferences = async (req, res) => {
  const { profileId } = req.params;
  const updateData = req.body;

  try {
    if (!profileId) {
      return res.status(400).json({ error: 'Profile ID is required' });
    }

    const {
      min_age,
      max_age,
      min_height,
      max_height,
      marital_status,
      mother_tongue,
      religion,
      caste,
      education_level,
      preferred_professions,
      location_preferences
    } = updateData;

    // Check if preferences already exist
    const [existing] = await pool.query(
      'SELECT id FROM partner_preference WHERE profile_id = ?',
      [profileId]
    );

    if (existing.length > 0) {
      // Update
      const updateQuery = `
        UPDATE partner_preference 
        SET 
          min_age = ?, 
          max_age = ?, 
          min_height = ?, 
          max_height = ?, 
          marital_status = ?, 
          mother_tongue = ?, 
          religion = ?, 
          caste = ?, 
          education_level = ?, 
          preferred_professions = ?, 
          location_preferences = ?
        WHERE profile_id = ?
      `;
      await pool.query(updateQuery, [
        min_age || null,
        max_age || null,
        min_height || null,
        max_height || null,
        marital_status || null,
        mother_tongue || null,
        religion || null,
        caste || null,
        education_level || null,
        preferred_professions || null,
        location_preferences || null,
        profileId
      ]);
    } else {
      // Insert
      const insertQuery = `
        INSERT INTO partner_preference (
          profile_id, 
          min_age, 
          max_age, 
          min_height, 
          max_height, 
          marital_status, 
          mother_tongue, 
          religion, 
          caste, 
          education_level, 
          preferred_professions, 
          location_preferences
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      await pool.query(insertQuery, [
        profileId,
        min_age || null,
        max_age || null,
        min_height || null,
        max_height || null,
        marital_status || null,
        mother_tongue || null,
        religion || null,
        caste || null,
        education_level || null,
        preferred_professions || null,
        location_preferences || null
      ]);
    }

    res.status(200).json({ message: 'Partner preferences updated successfully' });
  } catch (error) {
    console.error('Error updating partner preferences:', error);
    res.status(500).json({ error: 'Server error while updating partner preferences' });
  }
};

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

