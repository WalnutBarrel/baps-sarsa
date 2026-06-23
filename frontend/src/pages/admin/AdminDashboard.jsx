import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { 
  Users, 
  UserCheck, 
  Calendar, 
  LineChart, 
  Megaphone,
  MapPin
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalYuvaks: 1, todayAttendance: 0, pendingPrasangs: 0 });
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, eventsRes] = await Promise.all([
          api.get('/dashboard/stats'),
          api.get('/events')
        ]);
        setStats(statsRes.data);
        setEvents(eventsRes.data);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    { 
      title: 'TOTAL REGISTERED YOUTH', 
      value: stats.totalYuvaks || 1, 
      icon: <Users size={32} className="text-[#F37021]/50" />, 
      borderColor: 'border-[#F37021]',
      textColor: 'text-text-primary'
    },
    { 
      title: "TODAY'S ATTENDANCE", 
      value: stats.todayAttendance || 0, 
      icon: <UserCheck size={32} className="text-[#16a34a]/50" />, 
      borderColor: 'border-[#16a34a]',
      textColor: 'text-[#16a34a]'
    },
    { 
      title: 'ACTIVE SESSIONS', 
      value: 1, 
      icon: <Calendar size={32} className="text-[#3b82f6]/50" />, 
      borderColor: 'border-[#3b82f6]',
      textColor: 'text-[#3b82f6]'
    },
    { 
      title: 'AVG ATTENDANCE RATE', 
      value: stats.totalYuvaks ? `${Math.round((stats.todayAttendance / stats.totalYuvaks) * 100)}%` : '100%', 
      icon: <LineChart size={32} className="text-[#C8262C]/50" />, 
      borderColor: 'border-[#C8262C]',
      textColor: 'text-[#C8262C]'
    },
  ];

  if (loading) return <div className="p-8 text-center text-text-secondary">Loading dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* 4 Stat Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => (
          <div 
            key={idx} 
            className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex justify-between items-center border-l-4 ${card.borderColor}`}
          >
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-gray-400 tracking-wide uppercase">
                {card.title}
              </span>
              <span className={`text-3xl font-extrabold ${card.textColor}`}>
                {card.value}
              </span>
            </div>
            <div>
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom 2 Columns Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Column: Sabha Timings */}
        <div className="bg-[#f97316] rounded-xl shadow-sm text-white p-6 col-span-1">
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={20} className="text-white" />
            <h2 className="text-lg font-bold">Sabha Timings</h2>
          </div>
          <p className="text-xs text-white/90 mb-4">
            Sarsa Gram Sabha schedules details:
          </p>

          <div className="bg-black/10 rounded-lg p-4 space-y-3 mb-6">
            <div className="flex text-sm">
              <span className="font-bold w-20">Day:</span>
              <span className="text-white/90">Every Saturday</span>
            </div>
            <div className="flex text-sm">
              <span className="font-bold w-20">Time:</span>
              <span className="text-white/90">8:50 PM - 10:30 PM</span>
            </div>
            <div className="flex text-sm">
              <span className="font-bold w-20">Location:</span>
              <span className="text-white/90">Main Mandir, Sarsa</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-white/80 mt-auto pt-2">
            <MapPin size={14} className="text-[#fca5a5]" />
            <span>Sarsa Village Devotional Wing</span>
          </div>
        </div>

        {/* Right Column: Live Sabha Announcements */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 col-span-1 lg:col-span-2 min-h-[250px]">
          <div className="flex items-center gap-2 mb-4">
            <Megaphone size={20} className="text-[#C8262C]" />
            <h2 className="text-lg font-bold text-gray-800">Live Sabha Announcements & Events</h2>
          </div>
          
          <hr className="border-gray-200 mb-6" />

          {events.length === 0 ? (
            <p className="text-sm text-gray-400">
              Filhal koi naye special events live scheduled nahi hain.
            </p>
          ) : (
            <ul className="space-y-4">
              {events.map(e => (
                <li key={e.id} className="border-l-4 border-saffron pl-4 py-1">
                  <h3 className="font-bold text-gray-800">{e.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{e.description}</p>
                  <p className="text-xs text-gray-500 mt-2 font-medium">
                    {new Date(e.event_date).toLocaleDateString()} • {e.event_time}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
      
    </div>
  );
};

export default AdminDashboard;
