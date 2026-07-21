import pool from '../../config/db.js';

export const getAllPlans = async (req, res) => {
  try {
    const [plans] = await pool.query('SELECT * FROM bm_user_plans ORDER BY package_id ASC');
    
    // Parse the JSON plan_features field
    const formattedPlans = plans.map(plan => ({
      id: plan.package_id,
      name: plan.name,
      price: plan.pricing,
      duration: plan.duration,
      status: plan.plan_status.charAt(0).toUpperCase() + plan.plan_status.slice(1), // Capitalize first letter to match frontend (Active/Inactive)
      features: typeof plan.plan_features === 'string' ? JSON.parse(plan.plan_features) : plan.plan_features
    }));

    res.status(200).json({ plans: formattedPlans });
  } catch (error) {
    console.error('Error fetching plans:', error);
    res.status(500).json({ error: 'Failed to fetch plans' });
  }
};

export const updatePlan = async (req, res) => {
  const { id } = req.params; // this is package_id
  const { name, price, duration, status, features } = req.body;

  try {
    // Basic validation
    if (!name || price === undefined || !duration || !status) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const dbStatus = status.toLowerCase(); // frontend sends 'Active'/'Inactive', DB stores 'active'/'inactive'
    const featuresJson = JSON.stringify(features || []);

    const [result] = await pool.query(
      `UPDATE bm_user_plans 
       SET name = ?, pricing = ?, duration = ?, plan_status = ?, plan_features = ? 
       WHERE package_id = ?`,
      [name, price, duration, dbStatus, featuresJson, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    // Fetch the updated plan to return it
    const [updatedPlan] = await pool.query('SELECT * FROM bm_user_plans WHERE package_id = ?', [id]);
    const plan = updatedPlan[0];
    
    const formattedPlan = {
      id: plan.package_id,
      name: plan.name,
      price: plan.pricing,
      duration: plan.duration,
      status: plan.plan_status.charAt(0).toUpperCase() + plan.plan_status.slice(1),
      features: typeof plan.plan_features === 'string' ? JSON.parse(plan.plan_features) : plan.plan_features
    };

    res.status(200).json({ message: 'Plan updated successfully', plan: formattedPlan });
  } catch (error) {
    console.error('Error updating plan:', error);
    res.status(500).json({ error: 'Failed to update plan' });
  }
};
