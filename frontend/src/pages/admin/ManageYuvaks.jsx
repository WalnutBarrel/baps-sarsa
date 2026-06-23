import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Search, Plus, Upload, Trash2, Edit, QrCode, FileSpreadsheet, CloudUpload, X, Printer } from 'lucide-react';
import Swal from 'sweetalert2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import QRCode from 'react-qr-code';

const ManageYuvaks = () => {
  const [yuvaks, setYuvaks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [file, setFile] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showTerminalModal, setShowTerminalModal] = useState(false);
  const [terminalInput, setTerminalInput] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ 
    yuvak_no: '', 
    full_name: '', 
    mobile: '', 
    dob: '', 
    password: '' 
  });

  useEffect(() => {
    fetchYuvaks();
  }, []);

  const fetchYuvaks = async () => {
    try {
      const res = await api.get('/yuvaks');
      setYuvaks(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to fetch yuvaks' });
    } finally {
      setLoading(false);
    }
  };

  const handleBulkUpload = async () => {
    if (!file) {
      Swal.fire({ icon: 'warning', title: 'Missing File', text: 'Please select an Excel file' });
      return;
    }
    const uploadData = new FormData();
    uploadData.append('file', file);
    
    try {
      setLoading(true);

      const res = await api.post('/yuvaks/bulk-upload', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (res.data.errors && res.data.errors.length > 0) {
        Swal.fire({ 
          icon: 'warning', 
          title: 'Upload Completed with Errors', 
          html: `Processed successfully, but some rows were skipped:<br><br><div class="text-left text-xs max-h-32 overflow-y-auto">${res.data.errors.join('<br>')}</div>`, 
          confirmButtonColor: '#0b3f88' 
        });
      } else {
        Swal.fire({ icon: 'success', title: 'Success', text: 'All data uploaded successfully!', timer: 2000, confirmButtonColor: '#0b3f88' });
      }
      
      setFile(null);
      setShowUploadModal(false);
      fetchYuvaks();
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.error || 'Upload failed';
      Swal.fire({ icon: 'error', title: 'Upload Failed', text: errorMessage, confirmButtonColor: '#0b3f88' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/yuvaks/${editId}`, formData);
        Swal.fire({ icon: 'success', title: 'Updated!', text: 'Yuvak has been updated.', timer: 1500, confirmButtonColor: '#0b3f88' });
      } else {
        await api.post('/yuvaks', formData);
        Swal.fire({ icon: 'success', title: 'Created!', text: 'New Yuvak added successfully.', timer: 1500, confirmButtonColor: '#0b3f88' });
      }
      closeModal();
      fetchYuvaks();
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: 'error', title: 'Error', text: err.response?.data?.error || 'Failed to save yuvak' });
    }
  };

  const handleEdit = (yuvak) => {
    setFormData({
      yuvak_no: yuvak.yuvak_no || '',
      full_name: yuvak.full_name || '',
      mobile: yuvak.mobile || '',
      dob: yuvak.dob ? new Date(yuvak.dob).toISOString().split('T')[0] : '',
      password: ''
    });
    setEditId(yuvak.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#0b3f88',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/yuvaks/${id}`);
        setYuvaks(yuvaks.filter(y => y.id !== id));
        Swal.fire({ icon: 'success', title: 'Deleted!', text: 'Yuvak has been deleted.', timer: 1500, confirmButtonColor: '#0b3f88' });
      } catch (err) {
        console.error(err);
        Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to delete yuvak' });
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditId(null);
    setFormData({ yuvak_no: '', full_name: '', mobile: '', dob: '', password: '' });
  };

  const handleTerminalSubmit = async () => {
    if (!terminalInput) return;
    try {
      const res = await api.post('/attendance/mark', { yuvakNoOrMobile: terminalInput.trim() });
      Swal.fire({ icon: 'success', title: 'Checked In!', text: res.data.message || `${terminalInput} marked present.`, timer: 1500, confirmButtonColor: '#0b3f88' });
      setTerminalInput('');
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.error || 'Failed to mark attendance';
      Swal.fire({ icon: 'error', title: 'Attendance Failed', text: errorMsg, confirmButtonColor: '#0b3f88' });
    }
  };

  const handlePrintQR = () => {
    const svg = document.getElementById('qr-svg-container').innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Sabha QR</title>
          <style>
            body { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif; text-align: center; }
            h1 { color: #0b3f88; margin-bottom: 30px; font-size: 36px; text-transform: uppercase; letter-spacing: 2px; font-weight: 900; }
            .qr-container { padding: 30px; border: 4px solid #0b3f88; border-radius: 24px; display: inline-block; }
            svg { width: 500px; height: 500px; }
            p { margin-top: 20px; font-size: 20px; color: #666; font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>Sabha Attendance QR</h1>
          <div class="qr-container">
            ${svg}
          </div>
          <p>Scan using your smartphone camera</p>
          <script>
            setTimeout(() => {
              window.print();
              window.close();
            }, 500);
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const filteredYuvaks = yuvaks.filter(y => 
    y.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    y.yuvak_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    y.mobile?.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-heading font-bold text-blue">Manage Yuvaks</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowTerminalModal(true)}
            className="bg-white text-blue border-2 border-blue px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-blue/5 transition-colors shadow-sm cursor-pointer"
          >
            <QrCode size={18} /> Attendance Terminal
          </button>
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-[#0ca678] text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-[#099268] transition-colors shadow-sm cursor-pointer"
          >
            <Upload size={18} /> Upload Excel
          </button>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-saffron text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-[#d9621a] transition-colors shadow-sm cursor-pointer"
          >
            <Plus size={18} /> Add New
          </button>
        </div>
      </div>

      <div className="bg-card p-6 rounded-xl shadow-sm border border-blue/10 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-2 bg-surface border border-blue/20 rounded-lg px-3 py-2 w-full md:w-1/3">
          <Search size={18} className="text-text-secondary" />
          <input
            type="text"
            placeholder="Search by Name, Yuvak No, or Mobile"
            className="bg-transparent border-none focus:outline-none w-full text-sm outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-card rounded-xl shadow-sm border border-blue/10 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface border-b border-blue/10 text-text-secondary text-sm font-semibold uppercase tracking-wider">
              <th className="p-4">Yuvak No</th>
              <th className="p-4">Name</th>
              <th className="p-4">Mobile</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blue/5">
            {loading ? (
              <tr><td colSpan="4" className="p-4 text-center text-text-secondary">Loading...</td></tr>
            ) : filteredYuvaks.length === 0 ? (
              <tr><td colSpan="4" className="p-4 text-center text-text-secondary">No Yuvaks found.</td></tr>
            ) : (
              filteredYuvaks.map(yuvak => (
                <tr key={yuvak.id} className="hover:bg-surface/50 transition-colors">
                  <td className="p-4 font-medium text-blue">{yuvak.yuvak_no || '-'}</td>
                  <td className="p-4 text-text-primary">{yuvak.full_name}</td>
                  <td className="p-4 text-text-secondary">{yuvak.mobile}</td>
                  <td className="p-4 flex items-center gap-3">
                    <button onClick={() => handleEdit(yuvak)} className="text-blue hover:text-blue/80 cursor-pointer" title="Edit"><Edit size={18} /></button>
                    <button onClick={() => handleDelete(yuvak.id)} className="text-red hover:text-red/80 cursor-pointer" title="Delete"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-blue/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-card w-full max-w-md rounded-xl shadow-xl animate-fade-in">
            <div className="p-6 border-b border-blue/10 flex justify-between items-center rounded-t-xl">
              <h2 className="text-xl font-heading font-bold text-blue">
                {editId ? 'Edit Yuvak Details' : 'Add New Yuvak'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Full Name *</label>
                <input required type="text" placeholder="e.g. Rahul Patel" value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} className="w-full px-4 py-2 border border-blue/20 rounded-lg focus:ring-2 focus:ring-saffron/50 outline-none placeholder:text-gray-400 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">Mobile *</label>
                  <input required type="tel" placeholder="e.g. 9876543210" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} className="w-full px-4 py-2 border border-blue/20 rounded-lg focus:ring-2 focus:ring-saffron/50 outline-none placeholder:text-gray-400 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">Yuvak No</label>
                  <input type="text" placeholder="e.g. YUV-101" value={formData.yuvak_no} onChange={e => setFormData({...formData, yuvak_no: e.target.value})} className="w-full px-4 py-2 border border-blue/20 rounded-lg focus:ring-2 focus:ring-saffron/50 outline-none placeholder:text-gray-400 text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Date of Birth</label>
                <DatePicker 
                  selected={formData.dob ? new Date(formData.dob) : null}
                  onChange={(date) => {
                    const formattedDate = date ? date.toISOString().split('T')[0] : '';
                    setFormData({...formData, dob: formattedDate});
                  }}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Select Date of Birth"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  scrollableYearDropdown
                  yearDropdownItemNumber={60}
                  onKeyDown={(e) => e.preventDefault()}
                  className="w-full px-4 py-2 border border-blue/20 rounded-lg focus:ring-2 focus:ring-saffron/50 outline-none text-sm text-gray-700 cursor-pointer"
                  wrapperClassName="w-full"
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={closeModal} className="flex-1 px-4 py-2 text-text-secondary hover:bg-surface rounded-lg font-medium transition-colors cursor-pointer">Cancel</button>
                <button type="submit" className="flex-1 bg-blue text-white px-4 py-2 rounded-lg font-medium hover:bg-blue/90 transition-colors shadow-sm cursor-pointer">
                  {editId ? 'Update Yuvak' : 'Save Yuvak'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showUploadModal && (
        <div className="fixed inset-0 bg-blue/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-xl shadow-xl animate-fade-in border-t-[6px] border-[#0ca678] relative">
            <div className="p-8 pb-6">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <div className="bg-[#0ca678] text-white p-1.5 rounded-md">
                    <FileSpreadsheet size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Bulk Excel Upload</h2>
                </div>
                <button onClick={() => { setShowUploadModal(false); setFile(null); }} className="text-gray-400 hover:text-gray-600 mt-1 cursor-pointer">
                  <X size={20} />
                </button>
              </div>
              
              <p className="text-[13px] text-gray-500 mb-6 leading-relaxed">
                Upload spreadsheet using specific format columns to synchronize registry data automatically.
              </p>

              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors relative cursor-pointer mb-6 group">
                <input 
                  type="file" 
                  accept=".xlsx, .xls" 
                  onChange={(e) => setFile(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="bg-slate-400 text-white p-3.5 rounded-full mb-3 group-hover:bg-[#0ca678] transition-colors">
                  <CloudUpload size={28} />
                </div>
                <p className="font-semibold text-slate-700 text-sm">
                  {file ? file.name : "Choose file or drag & drop"}
                </p>
              </div>

              <button
                onClick={handleBulkUpload}
                disabled={!file || loading}
                className="w-full bg-[#0ca678] text-white py-3.5 rounded-lg font-bold tracking-wide hover:bg-[#099268] transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    UPLOADING...
                  </div>
                ) : (
                  'IMPORT BATCH DATA'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {showTerminalModal && (
        <div className="fixed inset-0 bg-blue/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-sm relative flex flex-col gap-4 animate-fade-in">
            <button 
              onClick={() => setShowTerminalModal(false)} 
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X size={28} />
            </button>
            
            {/* QR Card */}
            <div className="bg-white rounded-xl shadow-xl border-t-4 border-[#0b3f88] p-8 flex flex-col items-center text-center">
              <h2 className="text-[#0b3f88] font-black text-lg mb-6 tracking-wide uppercase">Sabha Attendance Scan QR</h2>
              <div id="qr-svg-container" className="p-3 border-2 border-gray-200 rounded-2xl bg-white shadow-sm">
                <QRCode 
                  value={`${window.location.origin}/user/attendance`}
                  size={160}
                  level="H"
                  fgColor="#0b3f88"
                />
              </div>
              <button 
                onClick={handlePrintQR} 
                className="mt-5 flex items-center gap-2 px-6 py-2.5 bg-[#0b3f88]/10 text-[#0b3f88] hover:bg-[#0b3f88]/20 rounded-full font-bold transition-colors cursor-pointer"
              >
                <Printer size={18} /> Print Poster
              </button>
            </div>

            {/* Manual Check-in Card */}
            <div className="bg-[#fff5eb] rounded-xl shadow-lg border border-[#fcd3b6] p-6 flex flex-col gap-4">
              <div className="flex items-center gap-2 text-[#d9621a] font-bold">
                <div className="w-4 h-6 border-2 border-[#d9621a] rounded flex items-center justify-center">
                  <div className="w-1 h-1 bg-[#d9621a] rounded-full mt-3"></div>
                </div>
                <h3>Yuvak Check-In Terminal</h3>
              </div>
              <input
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleTerminalSubmit(); }}
                placeholder="Enter Yuvak No. or Mobile (e.g., SRS001)"
                className="w-full px-4 py-3 rounded-lg border border-[#fcd3b6] focus:outline-none focus:ring-2 focus:ring-[#f37021]/50 bg-white text-gray-800 placeholder-gray-400"
              />
              <button
                onClick={handleTerminalSubmit}
                disabled={!terminalInput}
                className="w-full bg-[#f37021] hover:bg-[#d9621a] text-white py-3 rounded-lg font-bold tracking-wide transition-colors disabled:opacity-50 cursor-pointer"
              >
                SUBMIT ATTENDANCE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageYuvaks;
