import React, { useContext, useState, useEffect, useRef } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import bapsLogo from '../../00001.png';
import { Home, QrCode, ClipboardList, BookOpen, LogOut, Info, Activity, Menu, X, Key, Bell, CheckCircle, XCircle } from 'lucide-react';
import Swal from 'sweetalert2';
import api from '../api/axios';

const UserLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const notificationRef = useRef(null);

  useEffect(() => {
    if (user && user.role === 'user') {
      fetchNotifications();
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/prasangs/my');
      // Filter prasangs that have been reviewed (approved or rejected) and take top 5
      const reviewedPrasangs = res.data.filter(p => p.status !== 'pending').slice(0, 5);
      setNotifications(reviewedPrasangs);

      const seenIds = JSON.parse(localStorage.getItem(`seenNotificationIds_${user.id}`) || '[]');
      const hasNew = reviewedPrasangs.some(p => !seenIds.includes(p.id));
      setHasUnread(hasNew);
    } catch (err) {
      console.error('Failed to load notifications', err);
    }
  };

  const handleBellClick = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications && hasUnread) {
      setHasUnread(false);
      const allIds = notifications.map(n => n.id);
      localStorage.setItem(`seenNotificationIds_${user.id}`, JSON.stringify(allIds));
    }
  };

  if (!user || user.role !== 'user') {
    return <div className="p-8 text-center text-red">Unauthorized Access</div>;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleChangePassword = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Change Password',
      html:
        '<input id="swal-old-pwd" class="swal2-input" type="password" placeholder="Old Password">' +
        '<input id="swal-new-pwd" class="swal2-input" type="password" placeholder="New Password">',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Update',
      confirmButtonColor: '#f37021',
      preConfirm: () => {
        const oldPassword = document.getElementById('swal-old-pwd').value;
        const newPassword = document.getElementById('swal-new-pwd').value;
        if (!oldPassword || !newPassword) {
          Swal.showValidationMessage('Both fields are required');
        }
        return { oldPassword, newPassword };
      }
    });

    if (formValues) {
      try {
        await api.put('/auth/change-password', formValues);
        Swal.fire({ icon: 'success', title: 'Success', text: 'Password updated successfully!', timer: 1500, showConfirmButton: false });
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Error', text: err.response?.data?.error || 'Failed to update password', confirmButtonColor: '#f37021' });
      }
    }
  };

  const navLinks = [
    { to: '/user', icon: <Home size={20} />, label: 'Home', end: true },
    { to: '/user/attendance', icon: <QrCode size={20} />, label: 'Attendance' },
    { to: '/user/history', icon: <ClipboardList size={20} />, label: 'My History' },
    { to: '/user/prasangs', icon: <BookOpen size={20} />, label: 'Prasangs' },
    { to: '/user/help', icon: <Info size={20} />, label: 'Help & Info' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative overflow-hidden">
      {/* Overlay Backdrop */}
      {isNavOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={() => setIsNavOpen(false)}
        />
      )}

      {/* Side Drawer Navigation */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isNavOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-[#f37021] text-white">
          <div className="flex items-center gap-3">
            <img src={bapsLogo} alt="Logo" className="w-8 h-8 object-contain bg-white rounded-full p-0.5" />
            <h2 className="font-heading font-bold uppercase tracking-wider text-white">Menu</h2>
          </div>
          <button
            onClick={() => setIsNavOpen(false)}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={() => setIsNavOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive
                  ? 'bg-[#0b3f88] text-white shadow-sm'
                  : 'text-gray-600 hover:bg-[#0b3f88]/10 hover:text-[#0b3f88]'
                }`
              }
            >
              {link.icon}
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-[#f37021]/10 flex items-center justify-center text-[#f37021] font-bold">
              {user.full_name?.charAt(0) || 'Y'}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">{user.full_name}</p>
              <p className="text-xs text-gray-500">{user.yuvak_no || 'Yuvak'}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Top Header */}
      <header className="bg-[#f37021] text-white py-3 px-6 flex justify-between items-center border-b-4 border-[#0b3f88] z-30 relative">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsNavOpen(true)}
            className="p-2 hover:bg-white/10 rounded-md transition-colors cursor-pointer"
          >
            <Menu size={24} />
          </button>
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <img src={bapsLogo} alt="Logo" className="w-10 h-10 object-contain bg-white rounded-full p-0.5" />
              <h1 className="text-xl font-heading font-extrabold tracking-wide uppercase text-white drop-shadow-sm hidden sm:block">
                BAPS Sarsa
              </h1>
            </div>
            <div className="flex items-center gap-1 text-white/90 text-sm font-medium mt-1 sm:ml-12">
              <span>Yuvak Portal</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          
          {/* Notifications Dropdown */}
          <div className="relative" ref={notificationRef}>
            <button 
              onClick={handleBellClick}
              className="p-2 hover:bg-white/10 rounded-full transition-colors relative cursor-pointer"
            >
              <Bell size={20} />
              {hasUnread && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red rounded-full border border-[#f37021]"></span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 text-gray-800 animate-fade-in">
                <div className="p-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                  <h3 className="font-heading font-bold text-[#0b3f88]">Notifications</h3>
                  <span className="text-xs bg-[#0b3f88]/10 text-[#0b3f88] px-2 py-0.5 rounded-full font-bold">{notifications.length}</span>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-sm text-gray-500">No new notifications</div>
                  ) : (
                    notifications.map(n => (
                      <div key={n.id} className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors flex gap-3">
                        <div className="mt-0.5 flex-shrink-0">
                          {n.status === 'approved' ? <CheckCircle size={18} className="text-green-500" /> : <XCircle size={18} className="text-red" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <p className="text-sm font-bold text-gray-800 line-clamp-1">{n.title}</p>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${n.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red/10 text-red'}`}>
                              {n.status}
                            </span>
                          </div>
                          {n.admin_note && (
                            <p className="text-xs text-gray-600 mt-1.5 bg-gray-100 p-2 rounded-md border border-gray-200">
                              <span className="font-semibold text-gray-700">Note:</span> {n.admin_note}
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="px-4 py-2 rounded-lg bg-white/10 border border-white/30 text-white text-xs font-bold uppercase tracking-wider hidden lg:block shadow-sm">
            YUVAK: {user.mobile}
          </div>
          <button onClick={handleChangePassword} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/25 border border-white/20 text-white text-xs font-bold transition-all duration-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5 active:scale-95 active:translate-y-0 cursor-pointer hidden sm:flex">
            <Key size={14} /> Password
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#C8262C] hover:bg-[#a61c21] text-white text-xs font-bold transition-all duration-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5 active:scale-95 active:translate-y-0 border border-transparent cursor-pointer"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;
