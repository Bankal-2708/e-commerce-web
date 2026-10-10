import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Shield, LogOut, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../ContextAPI/AuthApi/authUse';

function ProfileSet() {
  const navigate = useNavigate();
  const { user, userRole, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/authscreen');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <div className="w-full max-w-md">

        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/home')}
            className="p-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-100 transition cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">My Profile</h1>
          <div className="w-9" />
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-gray-900 text-white flex items-center justify-center text-2xl font-bold mb-4 shadow-sm">
            {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            {user?.fullName || 'Oryanta User'}
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {user?.email || 'No email registered'}
          </p>
          <span className="inline-block mt-3 px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full uppercase tracking-wider">
            {userRole || user?.userRole || 'Customer'}
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-100 mb-6">
          <div className="flex items-center px-5 py-4">
            <User className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
            <div className="text-left flex-1">
              <p className="text-xs text-gray-400 font-medium">Full Name</p>
              <p className="text-sm font-semibold text-gray-800">
                {user?.fullName || 'Not provided'}
              </p>
            </div>
          </div>

          <div className="flex items-center px-5 py-4">
            <Mail className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
            <div className="text-left flex-1">
              <p className="text-xs text-gray-400 font-medium">Email</p>
              <p className="text-sm font-semibold text-gray-800">
                {user?.email || 'Not provided'}
              </p>
            </div>
          </div>

          <div className="flex items-center px-5 py-4">
            <Shield className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
            <div className="text-left flex-1">
              <p className="text-xs text-gray-400 font-medium">Account Role</p>
              <p className="text-sm font-semibold text-gray-800 capitalize">
                {userRole || user?.userRole || 'customer'}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-3.5 rounded-2xl transition flex items-center justify-center gap-2 cursor-pointer border border-red-100"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
}

export default ProfileSet;