import pool from '../../config/db.js';

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
