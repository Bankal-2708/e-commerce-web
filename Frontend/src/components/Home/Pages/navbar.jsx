import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  ShoppingCart,
  ArrowLeft,
  User,
  LogOut,
  Shirt,
  Store,
  Package,
  X,
  Loader,
} from 'lucide-react';
import { useCart } from '../../ContextAPI/CartContext/useCart';
import { useAuth } from '../../ContextAPI/AuthApi/authUse';

const API = '/api';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const { totalItems } = useCart();
  const { user, userRole, logout } = useAuth();

  const [search, setSearch] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  // suggestions ke liye products
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const searchRef = useRef(null);
  const userMenuRef = useRef(null);

  const isHomePage = location.pathname === '/home';

  // navbar mount pe products load karo (suggestions k liye)
  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);
      try {
        const res = await fetch(`${API}/products`, {
          credentials: 'include',
        });
        const data = await res.json();
        if (data.success && Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error('Navbar: failed to load products', err);
        setProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  // jab URL me q param ho to input me bhi dikhao
  useEffect(() => {
    if (location.pathname === '/shopList') {
      const params = new URLSearchParams(location.search);
      const q = params.get('q') || '';
      setSearch(q);
    }
  }, [location.pathname, location.search]);

  // bahar click pe dropdowns band
  useEffect(() => {
    const handleClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // suggestions filter — safe
  const query = (search || '').trim().toLowerCase();
  const suggestions = query.length > 0
    ? (products || [])
        .filter((p) => (p?.name || '').toLowerCase().includes(query))
        .slice(0, 8)
    : [];

  // matched text bold
  const highlightMatch = (text, q) => {
    if (!text || !q) return text || '';
    const idx = text.toLowerCase().indexOf(q.toLowerCase());
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <span className="font-bold text-gray-900">
          {text.slice(idx, idx + q.length)}
        </span>
        {text.slice(idx + q.length)}
      </>
    );
  };

  // search submit — Enter press ya search icon click pe
  // search khaali ho to saare products dikhao (bina q ke)
  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    const q = search.trim();

    setShowSuggestions(false);
    setMobileSearchOpen(false);

    if (q) {
      navigate(`/shopList?q=${encodeURIComponent(q)}`);
    } else {
      navigate('/shopList');
    }
  };

  // suggestion click → product page
  const handleSuggestionClick = (pid) => {
    setShowSuggestions(false);
    setSearch('');
    setMobileSearchOpen(false);
    navigate(`/product/${pid}`);
  };

  // search clear — sirf input clear, filter ShopList pe URL se hatayega
  const handleClearSearch = () => {
    setSearch('');
    setShowSuggestions(false);

    // agar ShopList pe h, URL se q hata do
    if (location.pathname === '/shopList') {
      const params = new URLSearchParams(location.search);
      params.delete('q');
      const qs = params.toString();
      navigate(`/shopList${qs ? `?${qs}` : ''}`, { replace: true });
    }
  };

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
    navigate('/authscreen');
  };

  const goBack = () => navigate(-1);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="w-full px-4 sm:px-6 md:px-8">
          <div className="flex items-center gap-2 sm:gap-3 py-2.5 sm:py-3">

            {/* back button */}
            {!isHomePage && (
              <button
                onClick={goBack}
                className="shrink-0 p-2 rounded-full hover:bg-gray-100 transition cursor-pointer"
                title="Back"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </button>
            )}

            {/* logo */}
            <button
              onClick={() => navigate('/home')}
              className="shrink-0 flex flex-col items-start cursor-pointer"
              title="Home"
            >
              <span className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight leading-none">
                ORYANTA
              </span>
              <span className="hidden sm:block text-[10px] text-gray-500 italic leading-none mt-0.5">
                your style, our technology
              </span>
            </button>

            {/* search bar */}
            <div
              ref={searchRef}
              className="flex-1 relative hidden sm:block mx-2 sm:mx-4"
            >
              <form onSubmit={handleSearchSubmit}>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search for products, brands and more"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    className="w-full pl-10 pr-20 py-2.5 bg-gray-100 rounded-lg text-sm text-gray-800 placeholder-gray-500 outline-none focus:bg-white focus:ring-2 focus:ring-black/10 border border-transparent focus:border-gray-300 transition"
                  />

                  {/* right side buttons — X (clear) + Search (submit) */}
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    {search && (
                      <button
                        type="button"
                        onClick={handleClearSearch}
                        className="p-1 rounded-full hover:bg-gray-200 transition cursor-pointer"
                        title="Clear"
                      >
                        <X size={14} className="text-gray-500" />
                      </button>
                    )}
                    <button
                      type="submit"
                      className="p-1.5 rounded-lg bg-black text-white hover:bg-gray-800 transition cursor-pointer"
                      title="Search"
                    >
                      <Search size={12} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              </form>

              {/* suggestions dropdown */}
              {showSuggestions && search.trim().length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-2xl overflow-hidden z-50 border border-gray-100 max-h-[70vh] overflow-y-auto">

                  {loadingProducts ? (
                    <div className="py-6 text-center">
                      <Loader className="w-5 h-5 animate-spin mx-auto text-gray-400" />
                    </div>
                  ) : suggestions.length > 0 ? (
                    <>
                      {suggestions.map((p) => (
                        <button
                          key={p._id}
                          onClick={() => handleSuggestionClick(p._id)}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition cursor-pointer text-left border-b border-gray-50 last:border-b-0"
                        >
                          <img
                            src={p.images?.[0] || '/placeholder.png'}
                            alt={p.name || ''}
                            className="w-9 h-9 rounded object-cover bg-gray-100 shrink-0"
                            onError={(e) => (e.target.src = '/placeholder.png')}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-700 truncate">
                              {highlightMatch(p.name || '', search.trim())}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              in {p.category || 'Products'}
                            </p>
                          </div>
                          <span className="text-xs text-gray-500 shrink-0">
                            ₹{p.price}
                          </span>
                        </button>
                      ))}

                      <button
                        onClick={handleSearchSubmit}
                        className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 transition cursor-pointer text-left border-t border-gray-100"
                      >
                        <div className="w-9 h-9 rounded bg-white border border-gray-200 flex items-center justify-center shrink-0">
                          <Search className="w-4 h-4 text-gray-500" />
                        </div>
                        <p className="text-sm text-gray-700">
                          See all results for "{search}"
                        </p>
                      </button>
                    </>
                  ) : (
                    <div className="px-4 py-6 text-center">
                      <p className="text-sm text-gray-500">
                        No products found for "{search}"
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* right side */}
            <div className="ml-auto flex items-center gap-1 sm:gap-2 shrink-0">

              {/* mobile search icon */}
              <button
                onClick={() => setMobileSearchOpen(true)}
                className="sm:hidden p-2 rounded-full hover:bg-gray-100 transition cursor-pointer"
                title="Search"
              >
                <Search className="w-5 h-5 text-gray-700" />
              </button>

              {/* cart */}
              <button
                onClick={() => navigate('/cart')}
                className="relative p-2.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-400 transition cursor-pointer"
                title="Cart"
              >
                <ShoppingCart className="w-5 h-5 text-gray-700" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </button>

              {/* user menu */}
              {user ? (
                <div ref={userMenuRef} className="hidden md:block relative">
                  <button
                    onClick={() => setShowUserMenu((v) => !v)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold">
                      {user.fullName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="text-sm font-medium text-gray-800 truncate max-w-[80px]">
                      {user.fullName?.split(' ')[0] || 'Account'}
                    </span>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-xs text-gray-500">Signed in as</p>
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {user.email}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          navigate('/profile');
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition cursor-pointer text-left"
                      >
                        <User size={16} className="text-gray-600" />
                        <span className="text-sm text-gray-800">My Profile</span>
                      </button>

                      <button
                        onClick={() => {
                          navigate('/wardrobe');
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition cursor-pointer text-left"
                      >
                        <Shirt size={16} className="text-gray-600" />
                        <span className="text-sm text-gray-800">My Wardrobe</span>
                      </button>

                      <button
                        onClick={() => {
                          navigate('/shopList');
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition cursor-pointer text-left"
                      >
                        <Package size={16} className="text-gray-600" />
                        <span className="text-sm text-gray-800">Orders</span>
                      </button>

                      {userRole === 'seller' && (
                        <button
                          onClick={() => {
                            navigate('/brand-portal');
                            setShowUserMenu(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition cursor-pointer text-left border-t border-gray-100"
                        >
                          <Store size={16} className="text-gray-600" />
                          <span className="text-sm text-gray-800">
                            Brand Portal
                          </span>
                        </button>
                      )}

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition cursor-pointer text-left border-t border-gray-100"
                      >
                        <LogOut size={16} className="text-red-600" />
                        <span className="text-sm text-red-600 font-medium">
                          Log Out
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => navigate('/authscreen')}
                  className="hidden md:block px-5 py-2 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition cursor-pointer"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>

        {/* mobile search overlay */}
        {mobileSearchOpen && (
          <div className="sm:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-40">
            <div className="p-3">
              <form onSubmit={handleSearchSubmit}>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search for products, brands..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setShowSuggestions(true);
                    }}
                    className="w-full pl-9 pr-20 py-3 bg-gray-100 rounded-xl text-sm text-gray-800 placeholder-gray-500 outline-none focus:bg-white focus:ring-2 focus:ring-black/10"
                  />

                  {/* mobile — clear + submit + close */}
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    {search && (
                      <button
                        type="button"
                        onClick={handleClearSearch}
                        className="p-1 rounded-full hover:bg-gray-200 transition cursor-pointer"
                      >
                        <X size={14} className="text-gray-500" />
                      </button>
                    )}
                    <button
                      type="submit"
                      className="p-1.5 rounded-lg bg-black text-white hover:bg-gray-800 transition cursor-pointer"
                    >
                      <Search size={12} strokeWidth={2.5} />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMobileSearchOpen(false);
                        setSearch('');
                        setShowSuggestions(false);
                      }}
                      className="p-1.5 rounded-full hover:bg-gray-200 transition cursor-pointer"
                      title="Close"
                    >
                      <X size={16} className="text-gray-600" />
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {showSuggestions && search.trim().length > 0 && (
              <div className="max-h-[70vh] overflow-y-auto border-t border-gray-100">
                {loadingProducts ? (
                  <div className="py-6 text-center">
                    <Loader className="w-5 h-5 animate-spin mx-auto text-gray-400" />
                  </div>
                ) : suggestions.length > 0 ? (
                  <>
                    {suggestions.map((p) => (
                      <button
                        key={p._id}
                        onClick={() => handleSuggestionClick(p._id)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition cursor-pointer text-left border-b border-gray-50 last:border-b-0"
                      >
                        <img
                          src={p.images?.[0] || '/placeholder.png'}
                          alt={p.name || ''}
                          className="w-9 h-9 rounded object-cover bg-gray-100 shrink-0"
                          onError={(e) => (e.target.src = '/placeholder.png')}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-700 truncate">
                            {highlightMatch(p.name || '', search.trim())}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            in {p.category || 'Products'}
                          </p>
                        </div>
                      </button>
                    ))}

                    <button
                      onClick={handleSearchSubmit}
                      className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 transition cursor-pointer text-left border-t border-gray-100"
                    >
                      <div className="w-9 h-9 rounded bg-white border border-gray-200 flex items-center justify-center shrink-0">
                        <Search className="w-4 h-4 text-gray-500" />
                      </div>
                      <p className="text-sm text-gray-700">
                        See all results for "{search}"
                      </p>
                    </button>
                  </>
                ) : (
                  <div className="px-4 py-6 text-center">
                    <p className="text-sm text-gray-500">
                      No products found for "{search}"
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </nav>

      <div className="h-14 sm:h-16" />
    </>
  );
}

export default Navbar;