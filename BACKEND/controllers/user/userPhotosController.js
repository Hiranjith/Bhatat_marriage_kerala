import pool from '../../config/db.js';
import fs from 'fs';
import path from 'path';

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
    const baseUrl = process.env.BACKEND_URL || 'http://localhost:5000';
    const photoUrl = `${baseUrl}/uploads/${req.file.filename}`;

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
