const supabase = require('../config/supabase');

exports.markAttendance = async (req, res) => {
  const { yuvakNoOrMobile } = req.body;
  const today = new Date().toISOString().split('T')[0];

  if (!yuvakNoOrMobile) {
    return res.status(400).json({ error: 'Yuvak No or Mobile is required' });
  }

  try {
    console.log('Marking attendance for:', yuvakNoOrMobile);
    // Find the user
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, yuvak_no, full_name, mobile')
      .or(`yuvak_no.ilike.${yuvakNoOrMobile},mobile.eq.${yuvakNoOrMobile}`)
      .single();

    console.log('User found:', user, 'Error:', userError);

    if (userError || !user) {
      return res.status(404).json({ error: 'Yuvak not found' });
    }

    // Check if already marked today
    const { data: existingAttendance } = await supabase
      .from('attendance_log')
      .select('id')
      .eq('user_id', user.id)
      .eq('attendance_date', today)
      .single();

    if (existingAttendance) {
      return res.status(400).json({ error: 'Attendance already marked for today' });
    }

    const now = new Date();
    const inTime = now.toTimeString().split(' ')[0]; // HH:MM:SS

    // Mark attendance
    const { data: newLog, error: logError } = await supabase
      .from('attendance_log')
      .insert([{
        user_id: user.id,
        yuvak_no: user.yuvak_no,
        full_name: user.full_name,
        mobile: user.mobile,
        attendance_date: today,
        in_time: inTime
      }])
      .select()
      .single();

    if (logError) throw logError;

    res.json({ message: 'Attendance marked successfully', log: newLog });
  } catch (error) {
    console.error('Error marking attendance:', error);
    res.status(500).json({ error: 'Failed to mark attendance' });
  }
};

exports.getAttendanceReport = async (req, res) => {
  const { date } = req.query;
  const queryDate = date || new Date().toISOString().split('T')[0];

  try {
    const { data, error } = await supabase
      .from('attendance_log')
      .select('*')
      .eq('attendance_date', queryDate)
      .order('in_time', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching attendance report:', error);
    res.status(500).json({ error: 'Failed to fetch report' });
  }
};

exports.getMyAttendanceHistory = async (req, res) => {
  const userId = req.user.id;

  try {
    const { data, error } = await supabase
      .from('attendance_log')
      .select('*')
      .eq('user_id', userId)
      .order('attendance_date', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
};
