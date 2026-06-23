import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Download, FileText, Calendar as CalendarIcon } from 'lucide-react';
import msmLogo from '../../assets/MSM.png';
import psmLogo from '../../assets/PSM.png';

const AttendanceReport = () => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReport();
  }, [date]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/attendance/report?date=${date}`);
      setReport(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch report');
    } finally {
      setLoading(false);
    }
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(report.map(r => ({
      'Yuvak No': r.yuvak_no,
      'Full Name': r.full_name,
      'Mobile': r.mobile,
      'In Time': r.in_time
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Attendance');
    XLSX.writeFile(wb, `Attendance_${date}.xlsx`);
  };

  const exportPDF = async () => {
    try {
      const doc = new jsPDF();
      
      const loadImage = (src) => new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });

      // Load images
      const imgLeft = await loadImage(msmLogo);
      const imgRight = await loadImage(psmLogo);

      // Header Background
      doc.setFillColor(253, 226, 211); // 20% Orange on white background
      doc.setDrawColor(0, 0, 0);       // Thin black border
      doc.setLineWidth(0.3);
      doc.rect(10, 5, 190, 32, 'FD');  // x, y, width, height, style (Fill & Draw)

      // Add images inside the header box
      doc.addImage(imgLeft, 'PNG', 12, 8, 26, 26);
      doc.addImage(imgRight, 'PNG', 172, 8, 26, 26); 

      doc.setFont(undefined, 'bold');
      doc.setFontSize(16);
      doc.text(`BAPS Sarsa Yuvak Attendance Report`, 105, 20, { align: 'center' });
      doc.setFontSize(12);
      doc.text(`Date: ${date}`, 105, 28, { align: 'center' });
      doc.setFont(undefined, 'normal');
      
      autoTable(doc, {
        startY: 42,
        head: [['Yuvak No', 'Full Name', 'Mobile', 'In Time']],
        body: report.map(r => [r.yuvak_no || '-', r.full_name, r.mobile, r.in_time]),
        theme: 'grid',
        headStyles: { fillColor: [13, 59, 102] }, // Sarsa blue
        bodyStyles: { textColor: [0, 0, 0] } // Black text
      });

      doc.save(`Attendance_${date}.pdf`);
    } catch (err) {
      console.error('Error generating PDF:', err);
      alert('Failed to generate PDF with images. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-heading font-bold text-blue">Daily Attendance Report</h1>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-surface border border-blue/20 rounded-lg px-3 py-2 shadow-sm">
            <CalendarIcon size={18} className="text-text-secondary" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-transparent border-none focus:outline-none text-sm font-medium text-text-primary"
            />
          </div>
          
          <button onClick={exportExcel} disabled={report.length === 0} className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-green-700 transition-colors disabled:opacity-50 shadow-sm">
            <Download size={18} /> Excel
          </button>
          
          <button onClick={exportPDF} disabled={report.length === 0} className="bg-red text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-red/90 transition-colors disabled:opacity-50 shadow-sm">
            <FileText size={18} /> PDF
          </button>
        </div>
      </div>

      <div className="bg-card p-6 rounded-xl shadow-sm border border-blue/10">
        <div className="flex items-center gap-6 mb-6 pb-6 border-b border-blue/10">
          <div>
            <p className="text-sm text-text-secondary">Total Present</p>
            <p className="text-3xl font-heading font-bold text-saffron">{report.length}</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface border-b border-blue/10 text-text-secondary text-sm font-semibold uppercase tracking-wider">
                <th className="p-4 rounded-tl-lg">Yuvak No</th>
                <th className="p-4">Name</th>
                <th className="p-4">Mobile</th>
                <th className="p-4 rounded-tr-lg">In Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue/5">
              {loading ? (
                <tr><td colSpan="4" className="p-4 text-center text-text-secondary">Loading...</td></tr>
              ) : report.length === 0 ? (
                <tr><td colSpan="4" className="p-4 text-center text-text-secondary">No attendance recorded for this date.</td></tr>
              ) : (
                report.map(record => (
                  <tr key={record.id} className="hover:bg-surface/50 transition-colors">
                    <td className="p-4 font-medium text-blue">{record.yuvak_no || '-'}</td>
                    <td className="p-4 text-text-primary">{record.full_name}</td>
                    <td className="p-4 text-text-secondary">{record.mobile}</td>
                    <td className="p-4 font-mono text-sm text-green-600">{record.in_time}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendanceReport;
