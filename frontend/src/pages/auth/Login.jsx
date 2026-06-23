import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Lock, Phone } from 'lucide-react';
import bapsLogo from '../../../00001.png';
import Swal from 'sweetalert2';
import api from '../../api/axios';

const Login = () => {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(mobile, password, role);
      if (data.user.role === 'admin') navigate('/admin');
      else navigate('/user');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Forgot Password?',
      html: `
        <div style="text-align: left; font-size: 14px; margin-bottom: 10px; color: #555;">
          Please enter your registered mobile number and Date of Birth to reset your password.
        </div>
        <input id="swal-mobile" class="swal2-input" type="tel" placeholder="Mobile Number" style="width: 80%; max-width: 100%; margin: 10px auto; display: block; box-sizing: border-box;">
        <input id="swal-dob" class="swal2-input" type="date" placeholder="Date of Birth" style="width: 80%; max-width: 100%; margin: 10px auto; display: block; box-sizing: border-box;">
        <input id="swal-new-pwd" class="swal2-input" type="password" placeholder="New Password" style="width: 80%; max-width: 100%; margin: 10px auto; display: block; box-sizing: border-box;">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Reset Password',
      confirmButtonColor: '#f37021',
      preConfirm: () => {
        const mobileInput = document.getElementById('swal-mobile').value;
        const dobInput = document.getElementById('swal-dob').value;
        const newPasswordInput = document.getElementById('swal-new-pwd').value;
        
        if (!mobileInput || !dobInput || !newPasswordInput) {
          Swal.showValidationMessage('All fields are required');
        }
        return { mobile: mobileInput, dob: dobInput, newPassword: newPasswordInput };
      }
    });

    if (formValues) {
      try {
        await api.post('/auth/reset-password', formValues);
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Your password has been reset successfully. You can now login.',
          confirmButtonColor: '#0b3f88'
        });
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Reset Failed',
          text: err.response?.data?.error || 'Verification failed. Please check your details.',
          confirmButtonColor: '#f37021'
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {/* Container: 2 columns on lg screens */}
      <div className="flex flex-col lg:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-5xl h-auto lg:h-[600px]">

        {/* Left Panel (Blue Gradient) */}
        <div className="lg:w-1/2 bg-gradient-to-br from-blue via-[#0d4a9e] to-[#041a38] text-white flex flex-col justify-between p-10 lg:p-12 border-r-8 border-saffron relative">
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">

            {/* REPLACE THIS SRC WITH YOUR ACTUAL LOGO PATH */}
            <div className="flex justify-center items-center animate-fade-in">
              <img
                src={bapsLogo}
                alt="BAPS Logo"
                className="w-36 h-36 object-contain mb-2 bg-white border-4 border-gold/50 rounded-xl p-2 shadow-lg hover:-translate-y-3 hover:scale-105 hover:shadow-2xl transition-all duration-300 ease-in-out cursor-pointer"
                onError={(e) => {
                // Fallback emoji if logo not found
                e.target.style.display = 'none';
              }}
            />
            <div className="text-6xl hidden" aria-hidden="true">🙏</div>
          </div>

            <h1 className="text-4xl font-heading font-extrabold leading-tight text-saffron drop-shadow-sm">
              BAPS Swaminarayan<br />Sanstha
            </h1>
            <p className="text-gold font-bold tracking-wide text-lg">Sarsa Yuvak Sabha Portal</p>
          </div>


        </div>

        {/* Right Panel (White) */}
        <div className="lg:w-1/2 bg-white p-10 lg:p-16 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-8">
            <Lock className="text-saffron w-8 h-8" />
            <h2 className="text-2xl font-heading font-bold text-text-primary">Portal Login</h2>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red/10 text-red border border-red/20 rounded-lg text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">

            {/* Role Context */}
            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Login Role Context</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron text-text-primary font-medium appearance-none bg-white"
              >
                <option value="admin">Admin Portal (Full Management)</option>
                <option value="user">Yuvak Portal (Personal Dashboard)</option>
              </select>
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Mobile Number</label>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Enter Mobile Number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron"
                required
              />
            </div>

            <div className="flex justify-end pt-2">
              <button 
                type="button" 
                onClick={handleForgotPassword}
                className="text-sm text-blue hover:underline font-medium"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#fa9c3e] hover:bg-saffron text-white py-4 rounded-lg font-bold tracking-wide uppercase transition-colors shadow-md mt-4 disabled:opacity-70"
            >
              {loading ? 'Authenticating...' : 'Secure Login'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Login;
