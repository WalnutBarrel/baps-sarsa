const supabase = require('../config/supabase');

exports.getAdminStats = async (req, res) => {
  try {
    const { count: totalYuvaks, error: yuvakError } = await supabase
      .from('users')
      .select('id', { count: 'exact', head: true })
      .eq('role', 'user');

    const now = new Date();
    const today = now.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
    const { count: todayAttendance, error: attError } = await supabase
      .from('attendance_log')
      .select('id', { count: 'exact', head: true })
      .eq('attendance_date', today);

    const { count: pendingPrasangs, error: praError } = await supabase
      .from('prasangs')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'pending');

    if (yuvakError || attError || praError) throw new Error('Database count error');

    res.json({
      totalYuvaks: totalYuvaks || 0,
      todayAttendance: todayAttendance || 0,
      pendingPrasangs: pendingPrasangs || 0
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load stats' });
  }
};

exports.getUpcomingBirthdays = async (req, res) => {
  try {
    // Basic approach: fetch all users with dob and filter by upcoming in Node
    // A robust Postgres query would extract day and month, but this is simpler for Supabase JS
    const { data: yuvaks, error } = await supabase
      .from('users')
      .select('id, full_name, dob')
      .not('dob', 'is', null);

    if (error) throw error;

    const today = new Date();
    const upcoming = yuvaks.filter(y => {
      const dob = new Date(y.dob);
      dob.setFullYear(today.getFullYear());
      const diffTime = dob - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 7;
    });

    res.json(upcoming);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch birthdays' });
  }
};
