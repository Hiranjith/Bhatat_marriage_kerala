import pool from '../../config/db.js';
import * as kollavarshamPkg from 'kollavarsham';

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
      'SELECT id, profile_id, full_name, country_code, mobile_number, email_address, religion, dob, gender, district, created_at FROM user_registration WHERE profile_id = ?',
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

    // Pass the dob, gender, and district from user_registration if they are missing in the religion table
    if (!profile.date_of_birth) {
      profile.date_of_birth = user.dob;
    }
    if (!profile.district) {
      profile.district = user.district;
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
        country = ?, state = ?, district = ?, place = ?, pincode = ?,
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
      updateData.pincode || null,
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

    // Head Franchise Logic: Check if pincode is updated
    if (updateData.pincode) {
      const pincode = String(updateData.pincode);
      // Check if any franchise covers this pincode using JSON_CONTAINS
      // JSON_CONTAINS expects JSON formatted string for the value
      const [franchises] = await pool.query(
        `SELECT franchise_id FROM BM_Franchise WHERE JSON_CONTAINS(pin_codes, ?)`,
        [JSON.stringify(pincode)]
      );

      if (franchises.length === 0) {
        // Cancel/delete any existing unassigned requests for this profile
        await pool.query(
          `DELETE FROM bm_head_franchise_requests WHERE profile_id = ? AND status = 'Unassigned'`,
          [profileId]
        );

        // Generate new REQ id
        const [latestReq] = await pool.query(
          `SELECT request_id FROM bm_head_franchise_requests ORDER BY id DESC LIMIT 1`
        );
        let nextReqId = 'REQ0001';
        if (latestReq.length > 0) {
           const num = parseInt(latestReq[0].request_id.replace('REQ', ''), 10);
           nextReqId = `REQ${String(num + 1).padStart(4, '0')}`;
        }

        // Insert new request
        await pool.query(
          `INSERT INTO bm_head_franchise_requests (request_id, profile_id, pincode, status) VALUES (?, ?, ?, 'Unassigned')`,
          [nextReqId, profileId, pincode]
        );
      } else {
        // If pincode exists in a franchise, delete any pending unassigned requests as it's now covered
        await pool.query(
          `DELETE FROM bm_head_franchise_requests WHERE profile_id = ? AND status = 'Unassigned'`,
          [profileId]
        );
      }
    }

    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
