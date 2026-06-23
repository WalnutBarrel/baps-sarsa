import React, { useState, useEffect, useContext } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import api from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';
import { CheckCircle, XCircle } from 'lucide-react';

const MarkAttendance = () => {
  const { user } = useContext(AuthContext);
  const [scanResult, setScanResult] = useState(null);
  const [manualInput, setManualInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: { width: 250, height: 250 },
      fps: 5,
    });

    scanner.render(onScanSuccess, onScanFailure);

    function onScanSuccess(result) {
      scanner.clear();
      setScanResult(result);
      
      // If the QR code is the Sabhe URL, mark own attendance using mobile
      if (result.includes('user/attendance') || result.includes('http')) {
        markAttendance(user.mobile);
      } else {
        markAttendance(result);
      }
    }

    function onScanFailure(error) {
      // Ignore failures as they happen frequently when scanning
    }

    return () => {
      scanner.clear().catch(error => console.error('Failed to clear scanner', error));
    };
  }, []);

  const markAttendance = async (identifier) => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await api.post('/attendance/mark', { yuvakNoOrMobile: identifier });
      setMessage({ type: 'success', text: `Attendance marked for ${res.data.log.full_name} at ${res.data.log.in_time}` });
    } catch (err) {
      const errorText = err.response?.data?.error || 'Failed to mark attendance';
      if (errorText === 'Attendance already marked for today') {
        setMessage({ type: 'info', text: 'Jay Swaminarayan! Your attendance is already marked for today.' });
      } else {
        setMessage({ type: 'error', text: errorText });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualInput.trim()) {
      markAttendance(manualInput.trim());
      setManualInput('');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-heading font-bold text-blue text-center mb-8">Mark Attendance</h1>

      <div className="bg-card p-6 rounded-xl shadow-md border border-blue/10">
        <h2 className="text-lg font-heading font-semibold text-blue mb-4 text-center">Scan Sabha QR Code</h2>
        <div id="reader" className="mx-auto overflow-hidden rounded-lg border-2 border-blue/20"></div>
        <p className="text-sm text-center text-gray-500 mt-4">Point your camera at the QR code displayed in the Sabha.</p>
      </div>

      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 shadow-sm border ${
          message.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 
          message.type === 'info' ? 'bg-blue/10 text-blue border-blue/20' : 
          'bg-red/10 text-red border-red/20'
        }`}>
          {message.type === 'success' ? <CheckCircle size={24} /> : 
           message.type === 'info' ? <CheckCircle size={24} /> : 
           <XCircle size={24} />}
          <p className="font-medium">{message.text}</p>
        </div>
      )}
    </div>
  );
};

export default MarkAttendance;
