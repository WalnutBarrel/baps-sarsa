import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Clock, CheckCircle } from 'lucide-react';

const AttendanceHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/attendance/my-history');
      setHistory(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-heading font-bold text-blue">My Attendance History</h1>
      </div>

      <div className="bg-card rounded-xl shadow-sm border border-blue/10 overflow-hidden p-6">
        {loading ? (
          <p className="text-center text-text-secondary">Loading history...</p>
        ) : history.length === 0 ? (
          <div className="text-center text-text-secondary py-12 flex flex-col items-center">
            <Clock size={48} className="text-blue/20 mb-4" />
            <p>You haven't marked any attendance yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map(record => (
              <div key={record.id} className="flex items-center justify-between border-b border-blue/10 last:border-0 pb-4 last:pb-0 pt-2">
                <div className="flex items-center gap-4">
                  <div className="bg-green-50 text-green-600 p-2 rounded-full">
                    <CheckCircle size={24} />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-text-primary text-lg">
                      {new Date(record.attendance_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </h3>
                    <p className="text-sm text-text-secondary">Marked present</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-saffron font-bold text-lg">
                    <Clock size={16} />
                    {record.in_time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceHistory;
