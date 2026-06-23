const supabase = require('../config/supabase');

exports.getMyActivities = async (req, res) => {
  const userId = req.user.id;
  try {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('user_id', userId)
      .order('activity_date', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
};

exports.addActivity = async (req, res) => {
  const { title, description, activity_date } = req.body;
  const user_id = req.user.id;

  try {
    const { data, error } = await supabase
      .from('activities')
      .insert([{ title, description, activity_date, user_id }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add activity' });
  }
};
