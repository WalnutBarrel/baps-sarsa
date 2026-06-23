import React, { useContext, useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import bapsLogo from '../../00001.png';
import Swal from 'sweetalert2';
import api from '../api/axios';
import {
  Home,
  CalendarPlus,
  CheckSquare,
  UserPlus,
  Users,
  FileText,
  BookOpen,
  HelpCircle,
  LogOut,
  Key,
  Clock,
  Menu,
  X
} from 'lucide-react';

const AdminLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isNavOpen, setIsNavOpen] = useState(false);

  if (!user || user.role !== 'admin') {
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
      confirmButtonColor: '#0b3f88',
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
        Swal.fire({ icon: 'error', title: 'Error', text: err.response?.data?.error || 'Failed to update password', confirmButtonColor: '#0b3f88' });
      }
    }
  };

  const navLinks = [
    { to: '/admin', icon: <Home size={20} />, label: 'Dashboard', end: true },
    { to: '/admin/events', icon: <CalendarPlus size={20} />, label: 'Create Event' },
    { to: '/admin/prasangs', icon: <CheckSquare size={20} />, label: 'Approve Prasangs', end: true },
    { to: '/admin/yuvaks', icon: <Users size={20} />, label: 'Manage Yuvaks' },
    { to: '/admin/reports', icon: <FileText size={20} />, label: 'Reports' },
    { to: '/admin/prasangs/feed', icon: <BookOpen size={20} />, label: 'Prasangs Feed' },
    { to: '/admin/help', icon: <HelpCircle size={20} />, label: 'Help' },
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
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-[#0b3f88] text-white">
          <div className="flex items-center gap-3">
            <img src={bapsLogo} alt="Logo" className="w-8 h-8 object-contain bg-white rounded-full p-0.5" />
            <h2 className="font-heading font-bold uppercase tracking-wider text-saffron">Menu</h2>
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
              key={link.label}
              to={link.to}
              end={link.end}
              onClick={() => setIsNavOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive
                  ? 'bg-[#fa9c3e] text-white shadow-sm'
                  : 'text-gray-600 hover:bg-[#fa9c3e]/10 hover:text-[#fa9c3e]'
                }`
              }
            >
              {link.icon}
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Top Blue Header */}
      <header className="bg-[#0b3f88] text-white py-3 px-6 flex justify-between items-center border-b-4 border-[#F37021] z-30 relative">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsNavOpen(true)}
            className="p-2 hover:bg-white/10 rounded-md transition-colors"
          >
            <Menu size={24} />
          </button>
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <img src={bapsLogo} alt="Logo" className="w-10 h-10 object-contain bg-white rounded-full p-0.5" />
              <h1 className="text-xl font-heading font-extrabold tracking-wide uppercase text-saffron drop-shadow-sm">
                BAPS Sarsa Yuvak Management System
              </h1>
            </div>
            <div className="flex items-center gap-1 text-[#D4A017] text-sm font-medium mt-1 ml-12">
              <Clock size={14} />
              <span>Saturday Sabha: 8:50 PM - 10:30 PM</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-lg bg-[#D4A017]/10 border border-[#D4A017]/30 text-[#D4A017] text-xs font-bold uppercase tracking-wider hidden md:block shadow-sm">
            ADMIN: {user.mobile || '9998273160'}
          </div>
          <button onClick={handleChangePassword} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/25 border border-white/20 text-white text-xs font-bold transition-all duration-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5 active:scale-95 active:translate-y-0 cursor-pointer">
            <Key size={14} /> Change Password
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
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
