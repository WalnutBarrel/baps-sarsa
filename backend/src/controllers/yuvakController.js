const supabase = require('../config/supabase');
const bcrypt = require('bcryptjs');
const xlsx = require('xlsx');

exports.getAllYuvaks = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, yuvak_no, full_name, mobile, role, dob, photo_url, created_at')
      .eq('role', 'user')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching yuvaks:', error);
    res.status(500).json({ error: 'Failed to fetch yuvaks' });
  }
};

exports.addYuvak = async (req, res) => {
  const { yuvak_no, full_name, mobile, dob, password } = req.body;

  if (!mobile || !full_name) {
    return res.status(400).json({ error: 'Mobile and Full Name are required' });
  }

  try {
    // Check if mobile or yuvak_no already exists safely
    let existingQuery = supabase.from('users').select('id').eq('mobile', mobile);
    let existing;
    
    if (yuvak_no && yuvak_no.trim() !== '') {
      const res = await supabase.from('users').select('id').or(`mobile.eq.${mobile},yuvak_no.eq.${yuvak_no}`).maybeSingle();
      existing = res.data;
    } else {
      const res = await existingQuery.maybeSingle();
      existing = res.data;
    }

    if (existing) {
      return res.status(400).json({ error: 'Yuvak with this mobile or Yuvak No already exists' });
    }

    const defaultPassword = password || mobile; // default to mobile if not provided
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(defaultPassword, salt);

    const { error } = await supabase
      .from('users')
      .insert([
        {
          yuvak_no: yuvak_no && yuvak_no.trim() !== '' ? yuvak_no : null,
          full_name,
          mobile,
          dob: dob && dob.trim() !== '' ? dob : null,
          password_hash,
          role: 'user',
        }
      ]);

    if (error) {
      console.error('Insert error:', error);
      return res.status(400).json({ error: error.message });
    }
    
    res.status(201).json({ message: 'Yuvak added successfully' });
  } catch (error) {
    console.error('Error adding yuvak:', error);
    res.status(500).json({ error: 'Failed to add yuvak' });
  }
};

exports.updateYuvak = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  delete updates.password_hash; // Security: don't allow direct hash update here
  delete updates.id;

  try {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    delete data.password_hash;
    res.json(data);
  } catch (error) {
    console.error('Error updating yuvak:', error);
    res.status(500).json({ error: 'Failed to update yuvak' });
  }
};

exports.deleteYuvak = async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = await supabase.from('users').delete().eq('id', id);
    if (error) throw error;
    res.json({ message: 'Yuvak deleted successfully' });
  } catch (error) {
    console.error('Error deleting yuvak:', error);
    res.status(500).json({ error: 'Failed to delete yuvak' });
  }
};

exports.bulkUploadYuvaks = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const records = xlsx.utils.sheet_to_json(sheet);

    if (records.length === 0) {
      return res.status(400).json({ error: 'File is empty' });
    }

    const salt = await bcrypt.genSalt(10);
    const inserts = [];
    const errors = [];

    for (let i = 0; i < records.length; i++) {
      const row = records[i];
      const yuvak_no = row['Yuvak No'] || row['YUVAK NO.'] || row.yuvak_no;
      const full_name = row['Full Name'] || row['FULL NAME'] || row.full_name;
      let mobile = row['Mobile'] || row['MOBILE NO.'] || row.mobile;
      let dobRaw = row['DOB'] || row['DATE OF BIRTH'] || row.dob;
      
      if (mobile) mobile = mobile.toString().trim();

      if (!full_name || !mobile) {
        errors.push(`Row ${i + 2}: Missing Name or Mobile`);
        continue;
      }

      const password_hash = await bcrypt.hash(mobile, salt);
      
      let dob = null;
      if (dobRaw) {
        if (typeof dobRaw === 'number') {
          // Excel serial date to JS Date
          dob = new Date(Math.round((dobRaw - 25569) * 86400 * 1000));
        } else if (typeof dobRaw === 'string') {
          const parts = dobRaw.split('-');
          if (parts.length === 3) {
            dob = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`); // DD-MM-YYYY to YYYY-MM-DD
          } else {
            dob = new Date(dobRaw);
          }
        }
        
        // If parsed date is invalid, just set it to null instead of breaking
        if (dob && isNaN(dob.getTime())) {
          dob = null;
        }
      }
      
      inserts.push({
        yuvak_no,
        full_name,
        mobile,
        password_hash,
        role: 'user',
        dob
      });
    }

    if (inserts.length > 0) {
      const { error } = await supabase.from('users').upsert(inserts, { onConflict: 'mobile', ignoreDuplicates: true });
      if (error) {
        console.error('Supabase Insert Error:', error);
        return res.status(400).json({ error: error.message || 'Database insert failed due to duplicate or invalid data.' });
      }
    }

    res.json({
      message: `Processed ${inserts.length} records successfully.`,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('Bulk upload error:', error);
    res.status(500).json({ error: 'Bulk upload failed' });
  }
};
