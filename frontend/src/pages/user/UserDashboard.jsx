import React, { useState, useEffect, useContext } from 'react';
import api from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';
import { Calendar, Clock, MapPin, Bell, QrCode, Gift, PartyPopper } from 'lucide-react';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const [birthdays, setBirthdays] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bdaysRes, eventsRes] = await Promise.all([
          api.get('/dashboard/birthdays'),
          api.get('/events')
        ]);
        setBirthdays(bdaysRes.data);
        setEvents(eventsRes.data.slice(0, 3)); // Show next 3 events
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue to-[#1a5b99] p-8 rounded-xl shadow-md text-white flex flex-col justify-center relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-heading font-bold text-white mb-2">Jay Swaminarayan, {user.full_name}!</h1>
          <p className="text-white/90 text-sm max-w-xl mb-6">
            Welcome to the BAPS Sarsa Yuvak Portal. Stay connected, mark your attendance, and participate in upcoming activities.
          </p>
          <Link to="/user/attendance" className="inline-flex items-center gap-2 bg-saffron hover:bg-[#d9621a] text-white px-5 py-2.5 rounded-lg font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
            <QrCode size={18} />
            Mark Attendance
          </Link>
        </div>
        {/* Decorative circle */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/5 rounded-full blur-2xl"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sabha Schedule */}
        <div className="bg-card p-6 rounded-xl shadow-sm border border-blue/10 col-span-1 lg:col-span-2">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-blue/10">
            <Clock className="text-saffron" size={24} />
            <h2 className="text-xl font-heading font-semibold text-blue">Weekly Sabha Schedule</h2>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-6 bg-surface p-4 rounded-lg border border-blue/5">
            <div className="flex-1">
              <p className="font-bold text-lg text-text-primary mb-1">Ravi Sabha (Youth)</p>
              <div className="flex items-center gap-2 text-sm text-text-secondary mb-1">
                <Calendar size={16} /> Saturday
              </div>
              <div className="flex items-center gap-2 text-sm text-text-secondary mb-1">
                <Clock size={16} /> 8:50 PM - 10:30 PM
              </div>
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <MapPin size={16} /> Main Mandir, Sarsa
              </div>
            </div>
            <div>
              <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider">
                Upcoming
              </span>
            </div>
          </div>
        </div>

        {/* Side Panel: Birthdays & Announcements */}
        <div className="space-y-6 col-span-1">
          {/* Birthdays */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-xl shadow-sm border border-orange-200 relative overflow-hidden group">
            {/* Decorative background element */}
            <PartyPopper className="absolute -right-4 -top-4 text-orange-200 opacity-50 transform rotate-12 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-45" size={100} />
            
            <h2 className="text-lg font-heading font-bold text-orange-600 mb-5 flex items-center gap-2 relative z-10">
              <Gift className="animate-bounce" size={20} />
              Upcoming Birthdays
            </h2>
            
            <div className="relative z-10">
              {loading ? (
                <div className="flex space-x-2 animate-pulse">
                  <div className="w-8 h-8 bg-orange-200 rounded-full"></div>
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-2 bg-orange-200 rounded"></div>
                    <div className="h-2 bg-orange-200 rounded w-5/6"></div>
                  </div>
                </div>
              ) : birthdays.length === 0 ? (
                <p className="text-sm text-orange-700/70 font-medium italic">No birthdays this week.</p>
              ) : (
                <ul className="space-y-3">
                  {birthdays.map((b) => {
                    const dob = new Date(b.dob);
                    const today = new Date();
                    const isToday = dob.getDate() === today.getDate() && dob.getMonth() === today.getMonth();
                    
                    return (
                      <li key={b.id} className="flex items-center gap-3 bg-white/60 p-2.5 rounded-lg border border-orange-100 hover:bg-white hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-inner ${isToday ? 'bg-gradient-to-r from-pink-500 to-orange-400 animate-pulse' : 'bg-gradient-to-br from-orange-400 to-yellow-400'}`}>
                          {b.full_name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-gray-800 text-sm truncate">
                              {b.full_name}
                            </p>
                            {isToday && <span className="text-[10px] bg-red text-white px-1.5 py-0.5 rounded-full uppercase font-bold animate-pulse flex-shrink-0">Today</span>}
                          </div>
                          <p className="text-xs font-medium text-orange-600/80">{dob.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>

          {/* Events */}
          <div className="bg-card p-6 rounded-xl shadow-sm border border-blue/10">
            <h2 className="text-lg font-heading font-semibold text-blue mb-4 flex items-center gap-2">
              <Bell size={18} /> Events
            </h2>
            {loading ? (
              <p className="text-sm text-text-secondary">Loading...</p>
            ) : events.length === 0 ? (
              <p className="text-sm text-text-secondary">No upcoming events.</p>
            ) : (
              <ul className="space-y-4">
                {events.map(e => (
                  <li key={e.id} className="border-l-2 border-saffron pl-3">
                    <p className="font-medium text-text-primary text-sm">{e.title}</p>
                    <p className="text-xs text-text-secondary">{new Date(e.event_date).toLocaleDateString()} at {e.event_time}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
