import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Package, ChevronDown, Plus, Minus } from 'lucide-react';
import { useCart } from '../../ContextAPI/CartContext/useCart';
import Navbar from './navbar';

const API = '/api';

const apiCall = (url, options = {}) =>
  fetch(`${API}${url}`, { credentials: 'include', ...options })
    .then((res) => res.json());

const CATEGORIES = ['All', 'Men', 'Women', 'Kids', 'Unisex', 'Accessories'];

function ShopList() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addToCart, increaseQty, decreaseQty, getQty } = useCart();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('default');

  // category URL se initial value
  const [category, setCategory] = useState(searchParams.get('category') || 'All');

  // search value URL ke q param se
  const [search, setSearch] = useState(searchParams.get('q') || '');

  const categoryBarRef = useRef(null);

  // URL me q ya category change hone pe state update karo
  useEffect(() => {
    const q = searchParams.get('q') || '';
    const cat = searchParams.get('category') || 'All';
    setSearch(q);
    setCategory(cat);
  }, [searchParams]);

  // products load karo
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await apiCall('/products');
        if (data.success && Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          setProducts([]);
          setError(data.message || 'Failed to load products');
        }
      } catch {
        setError('Could not connect to server');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // active category button ko center me laao
  useEffect(() => {
    if (!categoryBarRef.current) return;
    const activeBtn = categoryBarRef.current.querySelector('[data-active="true"]');
    if (activeBtn) {
      activeBtn.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [category]);

  // search + category filter (safe tarike se), phir sort
  const filtered = (products || [])
    .filter((p) =>
      (p?.name || '').toLowerCase().includes((search || '').toLowerCase())
    )
    .filter((p) => category === 'All' || p?.category === category)
    .sort((a, b) => {
      if (sortBy === 'lowToHigh') return (a.price || 0) - (b.price || 0);
      if (sortBy === 'highToLow') return (b.price || 0) - (a.price || 0);
      if (sortBy === 'newest')
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      return 0;
    });

  // har category me kitne products h
  const countFor = (cat) =>
    cat === 'All'
      ? (products || []).length
      : (products || []).filter((p) => p?.category === cat).length;

  // card pe button click pe card ka navigation rok do
  const handleAdd = (e, product) => {
    e.stopPropagation();
    addToCart(product, 1);
  };
  const handleDecrease = (e, product) => {
    e.stopPropagation();
    decreaseQty(product._id);
  };
  const handleIncrease = (e, product) => {
    e.stopPropagation();
    increaseQty(product._id);
  };

  // category tag click → URL update + state update
  const handleCategoryClick = (cat) => {
    setCategory(cat);

    // URL me bhi update karo
    const params = new URLSearchParams(searchParams);
    if (cat === 'All') {
      params.delete('category');
    } else {
      params.set('category', cat);
    }

    const qs = params.toString();
    navigate(`/shopList${qs ? `?${qs}` : ''}`, { replace: true });
  };

  // clear all filters
  const handleClearFilters = () => {
    setSearch('');
    setCategory('All');
    navigate('/shopList', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="w-full px-3 sm:px-6 md:px-10 py-4 sm:py-6">

        {/* top bar — heading + sort */}
        <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
          <h1 className="text-lg sm:text-xl font-bold text-gray-900">
            Shop
          </h1>

          <div className="relative shrink-0">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-black/10 cursor-pointer"
            >
              <option value="default">Sort: Default</option>
              <option value="lowToHigh">Price: Low - High</option>
              <option value="highToLow">Price: High - Low</option>
              <option value="newest">Newest First</option>
            </select>
            <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* category pills */}
        <div className="mb-5 -mx-3 sm:-mx-6 md:-mx-10 px-3 sm:px-6 md:px-10">
          <div className="relative">
            <div
              ref={categoryBarRef}
              className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory scroll-smooth"
            >
              {CATEGORIES.map((cat) => {
                const isActive = category === cat;
                const count = countFor(cat);
                return (
                  <button
                    key={cat}
                    data-active={isActive}
                    onClick={() => handleCategoryClick(cat)}
                    className={`shrink-0 snap-start px-3 sm:px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5
                      ${
                        isActive
                          ? 'bg-black text-white shadow-sm'
                          : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <span className="whitespace-nowrap">{cat}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-bold
                        ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
              <div className="shrink-0 w-2" />
            </div>

            {/* mobile pe right side fade */}
            <div className="pointer-events-none absolute right-0 top-0 bottom-2 w-10 bg-gradient-to-l from-gray-50 via-gray-50/80 to-transparent sm:hidden" />
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* products grid */}
        {loading ? (
          // loading skeleton
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse"
              >
                <div className="w-full h-56 bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 rounded w-1/3 mt-3" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          // koi product nahi mila
          <div className="bg-white rounded-2xl p-12 sm:p-16 text-center border border-gray-100">
            <Package className="w-14 h-14 mx-auto text-gray-300 mb-4" />
            <h3 className="font-semibold text-gray-800 text-lg">
              {search ? 'No products found' : 'No products yet'}
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              {search
                ? `No results for "${search}". Try a different term.`
                : category !== 'All'
                  ? `No products in ${category} category.`
                  : 'Check back soon!'}
            </p>
            {(search || category !== 'All') && (
              <button
                onClick={handleClearFilters}
                className="mt-4 text-sm font-semibold text-black underline cursor-pointer"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
            {filtered.map((p) => {
              const originalPrice = (p.price || 0) + (p.discountPrice || 0);
              const hasDiscount = p.discountPrice > 0;
              const qty = getQty(p._id);
              const inCart = qty > 0;

              return (
                <div
                  key={p._id}
                  onClick={() => navigate(`/product/${p._id}`)}
                  className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col"
                >
                  {/* product image + badges */}
                  <div className="relative overflow-hidden bg-gray-100">
                    <img
                      src={p.images?.[0] || '/placeholder.png'}
                      alt={p.name || 'product'}
                      className="w-full h-52 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => (e.target.src = '/placeholder.png')}
                    />
                    {hasDiscount && (
                      <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-lg">
                        {Math.round((p.discountPrice / originalPrice) * 100)}% OFF
                      </span>
                    )}
                    {p.stock === 0 && (
                      <span className="absolute top-2 right-2 bg-gray-900 text-white text-xs font-semibold px-2 py-1 rounded-lg">
                        Out of stock
                      </span>
                    )}
                    {p.category && (
                      <span className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-semibold px-2 py-1 rounded-lg">
                        {p.category}
                      </span>
                    )}
                  </div>

                  {/* product info */}
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {p.name}
                    </h3>
                    <p className="text-sm text-gray-500 truncate mt-0.5">
                      {p.description}
                    </p>

                    <div className="flex items-center gap-2 mt-3">
                      <span className="font-bold text-gray-900">
                        ₹{p.price}
                      </span>
                      {hasDiscount && (
                        <span className="text-xs line-through text-gray-400">
                          ₹{originalPrice}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-gray-400 mt-1">
                      {p.stock > 0
                        ? `In stock: ${p.stock}`
                        : 'Currently unavailable'}
                    </p>

                    {/* add to cart button ya qty controls */}
                    {p.stock === 0 ? (
                      <button
                        disabled
                        className="mt-3 w-full py-2 rounded-xl font-semibold text-sm bg-gray-100 text-gray-400 cursor-not-allowed"
                      >
                        Out of Stock
                      </button>
                    ) : !inCart ? (
                      <button
                        onClick={(e) => handleAdd(e, p)}
                        className="mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-xl font-semibold text-sm bg-black text-white hover:bg-gray-800 transition cursor-pointer"
                      >
                        <Plus size={16} /> Add to Cart
                      </button>
                    ) : (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="mt-3 w-full flex items-center justify-between bg-black text-white rounded-xl overflow-hidden"
                      >
                        <button
                          onClick={(e) => handleDecrease(e, p)}
                          className="px-3 py-2 hover:bg-gray-800 transition cursor-pointer"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="flex-1 text-center font-bold text-sm">
                          {qty}
                        </span>
                        <button
                          onClick={(e) => handleIncrease(e, p)}
                          disabled={qty >= p.stock}
                          className="px-3 py-2 hover:bg-gray-800 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default ShopList;