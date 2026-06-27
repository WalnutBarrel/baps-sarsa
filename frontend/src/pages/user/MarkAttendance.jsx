import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import api from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';
import { CheckCircle, XCircle, Camera, CameraOff, RefreshCw, ScanLine, ShieldCheck, AlertTriangle } from 'lucide-react';
import { formatTime } from '../../utils/formatTime';

const MarkAttendance = () => {
  const { user } = useContext(AuthContext);
  const [status, setStatus] = useState('initializing'); // initializing | scanning | success | error | permission_denied | already_marked
  const [message, setMessage] = useState('');
  const [attendeeName, setAttendeeName] = useState('');
  const [checkInTime, setCheckInTime] = useState('');
  const scannerRef = useRef(null);
  const hasProcessed = useRef(false);

  const stopScanner = useCallback(async () => {
    if (scannerRef.current) {
      try {
        const state = scannerRef.current.getState();
        if (state === 2) { // SCANNING
          await scannerRef.current.stop();
        }
      } catch (e) {
        // Ignore stop errors
      }
    }
  }, []);

  const markAttendance = useCallback(async (identifier) => {
    try {
      const res = await api.post('/attendance/mark', { yuvakNoOrMobile: identifier });
      setAttendeeName(res.data.log.full_name);
      setCheckInTime(res.data.log.created_at);
      setStatus('success');
      setMessage(`Jay Swaminarayan! Attendance marked successfully.`);
    } catch (err) {
      const errorText = err.response?.data?.error || 'Failed to mark attendance';
      if (errorText === 'Attendance already marked for today') {
        setStatus('already_marked');
        setMessage('Jay Swaminarayan! Your attendance is already recorded for today\'s Sabha.');
      } else {
        setStatus('error');
        setMessage(errorText);
      }
    }
  }, []);

  const startScanner = useCallback(async () => {
    hasProcessed.current = false;
    setStatus('initializing');
    setMessage('');

    try {
      const devices = await Html5Qrcode.getCameras();
      if (!devices || devices.length === 0) {
        setStatus('permission_denied');
        setMessage('No camera found on this device.');
        return;
      }

      // Prefer back camera on mobile
      const backCamera = devices.find(d => 
        d.label.toLowerCase().includes('back') || 
        d.label.toLowerCase().includes('rear') ||
        d.label.toLowerCase().includes('environment')
      );
      const cameraId = backCamera ? backCamera.id : devices[0].id;

      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode('qr-reader');
      }

      await scannerRef.current.start(
        cameraId,
        { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1 },
        (decodedText) => {
          if (hasProcessed.current) return;
          hasProcessed.current = true;
          
          // Stop scanner first, then process
          scannerRef.current.stop().then(() => {
            if (decodedText.includes('user/attendance') || decodedText.includes('http')) {
              markAttendance(user.mobile);
            } else {
              markAttendance(decodedText);
            }
          }).catch(() => {
            if (decodedText.includes('user/attendance') || decodedText.includes('http')) {
              markAttendance(user.mobile);
            } else {
              markAttendance(decodedText);
            }
          });
        },
        () => {} // Ignore scan failures
      );

      setStatus('scanning');
    } catch (err) {
      console.error('Camera error:', err);
      setStatus('permission_denied');
      if (err.toString().includes('NotAllowedError') || err.toString().includes('Permission')) {
        setMessage('Camera access was denied. Please allow camera permission in your browser settings and try again.');
      } else if (err.toString().includes('NotFoundError')) {
        setMessage('No camera found on this device. Please use a device with a camera.');
      } else if (err.toString().includes('NotReadableError')) {
        setMessage('Camera is being used by another application. Please close other apps using the camera.');
      } else {
        setMessage('Could not access the camera. Please check your browser permissions.');
      }
    }
  }, [markAttendance, user]);

  useEffect(() => {
    startScanner();
    return () => { stopScanner(); };
  }, [startScanner, stopScanner]);

  const handleRetry = async () => {
    await stopScanner();
    scannerRef.current = null;
    startScanner();
  };

  return (
    <div className="max-w-lg mx-auto space-y-5 px-4 pb-8">
      {/* Header */}
      <div className="text-center pt-2">
        <h1 className="text-2xl font-heading font-bold text-blue">Mark Attendance</h1>
        <p className="text-sm text-text-secondary mt-1">Scan the Sabha QR code to mark your presence</p>
      </div>

      {/* Scanner Card */}
      <div className="bg-card rounded-2xl shadow-lg border border-blue/10 overflow-hidden">
        
        {/* Camera Viewfinder */}
        <div className="relative bg-gray-900">
          <div 
            id="qr-reader" 
            className="w-full"
            style={{ 
              minHeight: status === 'scanning' || status === 'initializing' ? '320px' : '0px',
              display: status === 'scanning' || status === 'initializing' ? 'block' : 'none'
            }}
          />

          {/* Scanning overlay with animated corners */}
          {status === 'scanning' && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative w-[250px] h-[250px]">
                {/* Animated scan line */}
                <div className="absolute inset-x-2 top-2 h-0.5 bg-gradient-to-r from-transparent via-saffron to-transparent animate-scan-line" />
                
                {/* Corner brackets */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-3 border-l-3 border-saffron rounded-tl-lg" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-3 border-r-3 border-saffron rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-3 border-l-3 border-saffron rounded-bl-lg" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-3 border-r-3 border-saffron rounded-br-lg" />
              </div>
            </div>
          )}

          {/* Initializing state */}
          {status === 'initializing' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/80 text-white gap-3">
              <div className="w-10 h-10 border-3 border-white/30 border-t-saffron rounded-full animate-spin" />
              <p className="text-sm font-medium">Starting camera...</p>
            </div>
          )}
        </div>

        {status === 'scanning' && (
          <div className="px-5 py-4 bg-gradient-to-r from-blue/5 to-saffron/5 flex items-center gap-3">
            <ScanLine size={20} className="text-saffron shrink-0 animate-pulse" />
            <p className="text-sm text-text-primary font-medium">Point your camera at the Sabha QR code</p>
          </div>
        )}

        {/* Permission Denied State */}
        {status === 'permission_denied' && (
          <div className="p-8 text-center space-y-5">
            <div className="w-20 h-20 mx-auto bg-red/10 rounded-full flex items-center justify-center">
              <CameraOff size={36} className="text-red" />
            </div>
            <div>
              <h3 className="text-lg font-heading font-bold text-text-primary mb-2">Camera Access Required</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{message}</p>
            </div>
            
            <div className="bg-surface rounded-xl p-4 text-left space-y-2">
              <p className="text-xs font-bold text-text-secondary uppercase tracking-wider">How to enable camera:</p>
              <ol className="text-sm text-text-secondary space-y-1.5 list-decimal list-inside">
                <li>Tap the <strong>lock/camera icon</strong> in your browser's address bar</li>
                <li>Set Camera permission to <strong>"Allow"</strong></li>
                <li>Tap <strong>"Retry Camera"</strong> below</li>
              </ol>
            </div>

            <button 
                onClick={handleRetry}
                className="w-full bg-blue text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue/90 transition-colors cursor-pointer shadow-sm"
              >
                <RefreshCw size={18} /> Retry Camera
              </button>
              <p className="text-xs text-text-secondary text-center leading-relaxed">
                Can't scan? Contact your <strong>Sabha Admin/Manager</strong> to manually mark your attendance.
              </p>
          </div>
        )}

        {/* Success State */}
        {status === 'success' && (
          <div className="p-8 text-center space-y-5 animate-fade-in">
            <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center shadow-sm">
              <CheckCircle size={48} className="text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-heading font-bold text-green-700 mb-1">Attendance Marked!</h3>
              <p className="text-base text-text-primary font-semibold">{attendeeName}</p>
              {checkInTime && (
                <p className="text-sm text-text-secondary mt-1">
                  Checked in at <span className="font-medium text-blue">{formatTime(checkInTime)}</span>
                </p>
              )}
            </div>
            <p className="text-saffron font-heading font-bold text-lg">🙏 Jay Swaminarayan!</p>
            <button 
              onClick={handleRetry}
              className="w-full bg-blue/10 text-blue py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue/20 transition-colors cursor-pointer"
            >
              <Camera size={18} /> Scan Again
            </button>
          </div>
        )}

        {/* Already Marked State */}
        {status === 'already_marked' && (
          <div className="p-8 text-center space-y-5 animate-fade-in">
            <div className="w-24 h-24 mx-auto bg-blue/10 rounded-full flex items-center justify-center shadow-sm">
              <ShieldCheck size={48} className="text-blue" />
            </div>
            <div>
              <h3 className="text-xl font-heading font-bold text-blue mb-2">Already Checked In</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{message}</p>
            </div>
            <p className="text-saffron font-heading font-bold text-lg">🙏 Jay Swaminarayan!</p>
          </div>
        )}

        {/* Error State */}
        {status === 'error' && (
          <div className="p-8 text-center space-y-5 animate-fade-in">
            <div className="w-20 h-20 mx-auto bg-red/10 rounded-full flex items-center justify-center">
              <AlertTriangle size={36} className="text-red" />
            </div>
            <div>
              <h3 className="text-lg font-heading font-bold text-red mb-2">Something Went Wrong</h3>
              <p className="text-sm text-text-secondary">{message}</p>
            </div>
            <button 
              onClick={handleRetry}
              className="w-full bg-blue text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue/90 transition-colors cursor-pointer shadow-sm"
            >
              <RefreshCw size={18} /> Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarkAttendance;
