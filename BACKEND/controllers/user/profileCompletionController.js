import pool from '../../config/db.js';

export const getProfileCompletion = async (req, res) => {
  const { profileId } = req.params;
  
  try {
    if (!profileId) {
      return res.status(400).json({ error: 'Profile ID is required' });
    }

    const [users] = await pool.query(
      'SELECT religion, photo_1, photo_2, photo_3, photo_4 FROM user_registration WHERE profile_id = ?',
      [profileId]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = users[0];
    const isHindu = user.religion === 'Hindu';

    let matchingTable = 'others';
    switch (user.religion) {
      case 'Hindu': matchingTable = 'hindus'; break;
      case 'Christian': matchingTable = 'christians'; break;
      case 'Muslim': matchingTable = 'muslims'; break;
    }

    const [profileDetails] = await pool.query(
      `SELECT * FROM ${matchingTable} WHERE profile_id = ?`,
      [profileId]
    );
    const profile = profileDetails.length > 0 ? profileDetails[0] : {};

    const [prefDetails] = await pool.query(
      'SELECT * FROM partner_preference WHERE profile_id = ?',
      [profileId]
    );
    const prefs = prefDetails.length > 0 ? prefDetails[0] : {};

    const aboutMeScore = profile.about_me ? 5 : 0;

    const personalFields = ['name', 'gender', 'age', 'height', 'marital_status', 'profile_created_for'];
    const filledPersonal = personalFields.filter(f => profile[f] && profile[f] !== '').length;
    const personalScore = (filledPersonal / personalFields.length) * 17.5;

    const profFields = ['education', 'profession'];
    const filledProf = profFields.filter(f => profile[f] && profile[f] !== '').length;
    const profScore = (filledProf / profFields.length) * 7.5;

    const locFields = ['country', 'state', 'district', 'place'];
    const filledLoc = locFields.filter(f => profile[f] && profile[f] !== '').length;
    const locScore = (filledLoc / locFields.length) * 7.5;

    const famFields = ['fathers_name', 'fathers_job', 'mothers_name', 'mothers_job', 'sibling_details'];
    const filledFam = famFields.filter(f => profile[f] && profile[f] !== '').length;
    const famScore = (filledFam / famFields.length) * 5;

    let myProfileScore = 0;

    if (isHindu) {
      const horoFields = ['birth_time', 'nakshatra', 'rasi', 'date_of_birth_malayalam'];
      const filledHoro = horoFields.filter(f => profile[f] && profile[f] !== '').length;
      const horoScore = (filledHoro / horoFields.length) * 7.5;

      myProfileScore = aboutMeScore + personalScore + profScore + locScore + famScore + horoScore;
    } else {
      const rawScore = aboutMeScore + personalScore + profScore + locScore + famScore;
      myProfileScore = (rawScore / 42.5) * 50;
    }

    const prefFields = [
      'min_age', 'max_age', 'min_height', 'max_height', 
      'marital_status', 'mother_tongue', 'religion', 
      'caste', 'education_level', 'preferred_professions', 'location_preferences'
    ];
    const filledPrefs = prefFields.filter(f => prefs[f] && prefs[f] !== '').length;
    const partnerPrefScore = (filledPrefs / prefFields.length) * 30;

    const photoFields = ['photo_1', 'photo_2', 'photo_3', 'photo_4'];
    const filledPhotos = photoFields.filter(f => user[f] && user[f] !== '').length;
    const photosScore = (filledPhotos / photoFields.length) * 20;

    const totalCompletionRaw = myProfileScore + partnerPrefScore + photosScore;
    const totalCompletion = Math.round(totalCompletionRaw / 5) * 5;

    res.status(200).json({
      message: 'Completion percentage fetched successfully',
      percentage: totalCompletion
    });
  } catch (error) {
    console.error('Error calculating profile completion:', error);
    res.status(500).json({ error: 'Server error while calculating profile completion' });
  }
};
