import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, Store } from 'lucide-react';
import logoImg from '../../assets/images/logo.jpeg';
import { useAuth } from '../ContextAPI/AuthApi/authUse';

function AuthScreen() {
  const { userRole, setUserRole } = useAuth();
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });

  const [signupForm, setSignupForm] = useState({
    fullName: '',
    email: '',
    password: '',
    userRole: 'customer', 
  });



  const isLogin = activeTab === 'login';

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleFullNameChange = (e) => {
    setSignupForm((prev) => ({ ...prev, fullName: e.target.value }));
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    if (isLogin) {
      setLoginForm((prev) => ({ ...prev, email: value }));
    } else {
      setSignupForm((prev) => ({ ...prev, email: value }));
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    if (isLogin) {
      setLoginForm((prev) => ({ ...prev, password: value }));
    } else {
      setSignupForm((prev) => ({ ...prev, password: value }));
    }
  };

  const handleRoleSelect = (role) => {
    console.log('Role selected:', role);
    setSignupForm((prev) => ({ ...prev, userRole: role }));
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    console.log('Current role from Context:', userRole);
    console.log('Current role from signupForm (Bydefault):', signupForm.userRole);

    if (isLogin) {
      console.log('Login Details:', loginForm);
    } else {

      console.log('Signup Details:', signupForm);
      setUserRole(signupForm.userRole);
      console.log('User role set in context:', signupForm.userRole);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white flex flex-col items-center justify-center px-4 py-10 font-sans select-none">
      <div className="w-full max-w-[460px] flex flex-col items-center">
        <div className="w-28 h-28 md:w-32 md:h-32 mb-6 bg-black rounded-2xl flex items-center justify-center overflow-hidden shadow-sm">
          <img
            src={logoImg}
            alt="Oryanta Logo"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-contain"
          />
        </div>

        <div className="text-center mb-7">
          <h1 className="text-[28px] md:text-3xl font-bold text-gray-900 tracking-tight flex items-center justify-center gap-2 transition-all duration-300">
            {isLogin ? (
              <>
                <span>Welcome Back</span> <span>✨</span>
              </>
            ) : (
              <span>Create Your Oryanta Account</span>
            )}
          </h1>
          <p className="text-sm text-gray-400 mt-2 font-normal transition-all duration-300">
            {isLogin
              ? 'Continue your personalized fashion journey.'
              : 'Join Oryanta and discover fashion made for you.'}
          </p>
        </div>

        <div className="w-full bg-[#f0f0f0] p-1.5 rounded-2xl flex items-center mb-6">
          <button
            type="button"
            onClick={() => handleTabSwitch('login')}
            className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${isLogin
              ? 'bg-black text-white shadow-sm'
              : 'text-gray-600 hover:text-black'
              }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => handleTabSwitch('signup')}
            className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${!isLogin
              ? 'bg-black text-white shadow-sm'
              : 'text-gray-600 hover:text-black'
              }`}
          >
            Sign Up
          </button>
        </div>

        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
          <div
            className={`grid transition-all duration-300 ease-in-out ${!isLogin ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 pointer-events-none'
              }`}
          >
            <div className="overflow-hidden">
              <div className="w-full flex items-center bg-white border border-gray-100 rounded-2xl px-5 py-4 shadow-[0_1px_4px_rgba(0,0,0,0.04)] focus-within:border-gray-300">
                <User className="w-5 h-5 text-gray-700 mr-3.5 shrink-0" strokeWidth={1.8} />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={signupForm.fullName}
                  onChange={handleFullNameChange}
                  className="w-full text-sm md:text-base text-gray-800 placeholder-gray-400 outline-none bg-transparent"
                />
              </div>
            </div>
          </div>

          <div className="w-full flex items-center bg-white border border-gray-100 rounded-2xl px-5 py-4 shadow-[0_1px_4px_rgba(0,0,0,0.04)] focus-within:border-gray-300">
            <Mail className="w-5 h-5 text-gray-700 mr-3.5 shrink-0" strokeWidth={1.8} />
            <input
              type="email"
              placeholder="Email"
              value={isLogin ? loginForm.email : signupForm.email}
              onChange={handleEmailChange}
              className="w-full text-sm md:text-base text-gray-800 placeholder-gray-400 outline-none bg-transparent"
            />
          </div>

          <div className="w-full flex items-center bg-white border border-gray-100 rounded-2xl px-5 py-4 shadow-[0_1px_4px_rgba(0,0,0,0.04)] focus-within:border-gray-300">
            <Lock className="w-5 h-5 text-gray-700 mr-3.5 shrink-0" strokeWidth={1.8} />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={isLogin ? loginForm.password : signupForm.password}
              onChange={handlePasswordChange}
              className="w-full text-sm md:text-base text-gray-800 placeholder-gray-400 outline-none bg-transparent"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="text-gray-500 hover:text-black ml-2 focus:outline-none"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" strokeWidth={1.8} />
              ) : (
                <Eye className="w-5 h-5" strokeWidth={1.8} />
              )}
            </button>
          </div>

          <div
            className={`grid transition-all duration-300 ease-in-out ${!isLogin ? 'grid-rows-[1fr] opacity-100 mt-2' : 'grid-rows-[0fr] opacity-0 pointer-events-none mt-0'
              }`}
          >
            <div className="overflow-hidden">
              <div className="text-left pb-1">
                <p className="text-sm font-semibold text-gray-900 mb-3">
                  How will you use Oryanta?
                </p>
                <div className="grid grid-cols-2 gap-3.5">
                  <div
                    onClick={() => handleRoleSelect('customer')}
                    className={`cursor-pointer rounded-2xl p-4 md:p-5 border transition-all duration-200 ${signupForm.userRole === 'customer'
                      ? 'bg-black text-white border-black shadow-sm'
                      : 'bg-white text-gray-800 border-gray-100 hover:border-gray-200'
                      }`}
                  >
                    <User
                      className={`w-5 h-5 mb-3.5 ${signupForm.userRole === 'customer' ? 'text-white' : 'text-gray-800'
                        }`}
                      strokeWidth={1.8}
                    />
                    <p className="text-sm font-bold leading-tight">Fashion User</p>
                    <p
                      className={`text-xs mt-1 ${signupForm.userRole === 'customer' ? 'text-gray-300' : 'text-gray-400'
                        }`}
                    >
                      Discover & style
                    </p>
                  </div>

                  <div
                    onClick={() => handleRoleSelect('seller')}
                    className={`cursor-pointer rounded-2xl p-4 md:p-5 border transition-all duration-200 ${signupForm.userRole === 'seller'
                      ? 'bg-black text-white border-black shadow-sm'
                      : 'bg-white text-gray-800 border-gray-100 hover:border-gray-200'
                      }`}
                  >
                    <Store
                      className={`w-5 h-5 mb-3.5 ${signupForm.userRole === 'seller' ? 'text-white' : 'text-gray-800'
                        }`}
                      strokeWidth={1.8}
                    />
                    <p className="text-sm font-bold leading-tight">Brand / Seller</p>
                    <p
                      className={`text-xs mt-1 ${signupForm.userRole === 'seller' ? 'text-gray-300' : 'text-gray-400'
                        }`}
                    >
                      Sell on Oryanta
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-black hover:bg-neutral-900 text-white font-semibold py-4 rounded-2xl transition-all duration-200 active:scale-[0.99] text-sm md:text-base mt-2 shadow-sm"
          >
            {isLogin ? 'Login' : 'Create Account'}
          </button>

          <div
            className={`grid transition-all duration-300 ease-in-out ${!isLogin ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 pointer-events-none'
              }`}
          >
            <div className="overflow-hidden">
              <p className="text-xs text-gray-400 text-center mt-3">
                By continuing, you agree to Oryanta's Terms & Privacy Policy.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AuthScreen;