const supabase = require('../config/supabase');

exports.getApprovedPrasangs = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('prasangs')
      .select('*, users(full_name, yuvak_no, mobile)')
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch prasangs feed' });
  }
};

exports.getMyPrasangs = async (req, res) => {
  const userId = req.user.id;
  try {
    const { data, error } = await supabase
      .from('prasangs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch your prasangs' });
  }
};

exports.getPendingPrasangs = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('prasangs')
      .select('*, users(full_name, yuvak_no, mobile)')
      .eq('status', 'pending')
      .order('created_at', { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pending prasangs' });
  }
};

exports.submitPrasang = async (req, res) => {
  const { title, description } = req.body;
  const user_id = req.user.id;

  try {
    const { data, error } = await supabase
      .from('prasangs')
      .insert([{ title, description, user_id }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit prasang' });
  }
};

exports.reviewPrasang = async (req, res) => {
  const { id } = req.params;
  const { status, admin_note } = req.body;

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  try {
    const { data, error } = await supabase
      .from('prasangs')
      .update({ status, admin_note })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to review prasang' });
  }
};

exports.deletePrasang = async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = await supabase
      .from('prasangs')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ message: 'Prasang deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Failed to delete prasang' });
  }
};
