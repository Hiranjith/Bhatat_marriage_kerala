import pool from './config/db.js';

async function run() {
  try {
    const [users] = await pool.query('SELECT profile_id, full_name, religion, photo_1, photo_2, photo_3, photo_4 FROM user_registration WHERE full_name LIKE ?', ['%Hiranjith%']);
    console.log('Users:', users);
    if (users.length > 0) {
      const pId = users[0].profile_id;
      const [h] = await pool.query('SELECT * FROM hindus WHERE profile_id = ?', [pId]);
      console.log('Hindus profile:', h[0]);
      
      const [pp] = await pool.query('SELECT * FROM partner_preference WHERE profile_id = ?', [pId]);
      console.log('Prefs:', pp[0]);

      // Calculate score like the backend
      const user = users[0];
      const profile = h[0] || {};
      const prefs = pp[0] || {};
      const isHindu = user.religion === 'Hindu';

      const aboutMeScore = profile.about_me ? 5 : 0;

      const personalFields = ['name', 'gender', 'age', 'height', 'marital_status', 'profile_created_for'];
      const filledPersonal = personalFields.filter(f => profile[f] && profile[f] !== '');
      console.log('Filled Personal:', filledPersonal, 'Missing:', personalFields.filter(f => !filledPersonal.includes(f)));
      const personalScore = (filledPersonal.length / personalFields.length) * 17.5;

      const profFields = ['education', 'profession'];
      const filledProf = profFields.filter(f => profile[f] && profile[f] !== '');
      console.log('Filled Prof:', filledProf, 'Missing:', profFields.filter(f => !filledProf.includes(f)));
      const profScore = (filledProf.length / profFields.length) * 7.5;

      const locFields = ['country', 'state', 'district', 'place'];
      const filledLoc = locFields.filter(f => profile[f] && profile[f] !== '');
      console.log('Filled Loc:', filledLoc, 'Missing:', locFields.filter(f => !filledLoc.includes(f)));
      const locScore = (filledLoc.length / locFields.length) * 7.5;

      const famFields = ['fathers_name', 'fathers_job', 'mothers_name', 'mothers_job', 'sibling_details'];
      const filledFam = famFields.filter(f => profile[f] && profile[f] !== '');
      console.log('Filled Fam:', filledFam, 'Missing:', famFields.filter(f => !filledFam.includes(f)));
      const famScore = (filledFam.length / famFields.length) * 5;

      let myProfileScore = 0;

      if (isHindu) {
        const horoFields = ['birth_time', 'nakshatra', 'rasi', 'date_of_birth_malayalam'];
        const filledHoro = horoFields.filter(f => profile[f] && profile[f] !== '');
        console.log('Filled Horo:', filledHoro, 'Missing:', horoFields.filter(f => !filledHoro.includes(f)));
        const horoScore = (filledHoro.length / horoFields.length) * 7.5;

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
      const filledPrefs = prefFields.filter(f => prefs[f] && prefs[f] !== '');
      console.log('Filled Prefs:', filledPrefs, 'Missing:', prefFields.filter(f => !filledPrefs.includes(f)));
      const partnerPrefScore = (filledPrefs.length / prefFields.length) * 30;

      const photoFields = ['photo_1', 'photo_2', 'photo_3', 'photo_4'];
      const filledPhotos = photoFields.filter(f => user[f] && user[f] !== '');
      console.log('Filled Photos:', filledPhotos, 'Missing:', photoFields.filter(f => !filledPhotos.includes(f)));
      const photosScore = (filledPhotos.length / photoFields.length) * 20;

      const totalCompletionRaw = myProfileScore + partnerPrefScore + photosScore;
      const totalCompletion = Math.round(totalCompletionRaw / 5) * 5;

      console.log({
        aboutMeScore,
        personalScore,
        profScore,
        locScore,
        famScore,
        myProfileScore,
        partnerPrefScore,
        photosScore,
        totalCompletionRaw,
        totalCompletion
      });
    }
  } catch (e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}
run();
