import pool from '../../config/db.js';

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
