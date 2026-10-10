import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ShoppingCart,
  Plus,
  Minus,
  Star,
  Truck,
  ShieldCheck,
  RotateCcw,
  Heart,
  Package,
  ChevronRight,
  ChevronLeft,
  Share2,
  Tag,
  X,
} from 'lucide-react';
import { useCart } from '../../ContextAPI/CartContext/useCart';
import Navbar from './navbar';

const API = '/api';

const apiCall = (url, options = {}) =>
  fetch(`${API}${url}`, { credentials: 'include', ...options })
    .then((res) => res.json());

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, increaseQty, decreaseQty, getQty } = useCart();

  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [sizeError, setSizeError] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);   // full screen image viewer

  const similarRef = useRef(null);

  // product + saare products fetch karo
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const [prodRes, allRes] = await Promise.all([
          apiCall(`/products/${id}`),
          apiCall('/products'),
        ]);

        if (!prodRes.success) throw new Error(prodRes.message || 'Product not found');
        setProduct(prodRes.product);

        // pehla size default select kar do
        if (prodRes.product.sizes?.length > 0) {
          setSelectedSize(prodRes.product.sizes[0]);
        }
        if (allRes.success) setAllProducts(allRes.products);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  // similar = same category, other = different category
  const similarProducts = allProducts
    .filter((p) => p.category === product?.category && p._id !== product?._id)
    .slice(0, 10);

  const otherProducts = allProducts
    .filter((p) => p.category !== product?.category && p._id !== product?._id)
    .slice(0, 10);

  const qty = product ? getQty(product._id) : 0;
  const inCart = qty > 0;

  const originalPrice = product ? product.price + (product.discountPrice || 0) : 0;
  const hasDiscount = product?.discountPrice > 0;
  const discountPercent = hasDiscount
    ? Math.round((product.discountPrice / originalPrice) * 100)
    : 0;

  // add to cart — size zaroori h
  const handleAdd = () => {
    if (!selectedSize) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 2000);
      return;
    }
    addToCart({ ...product, selectedSize }, 1);
  };

  // buy now — add karke cart pe bhej do
  const handleBuyNow = () => {
    if (!selectedSize) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 2000);
      return;
    }
    if (!inCart) {
      addToCart({ ...product, selectedSize }, 1);
    }
    setTimeout(() => navigate('/cart'), 300);
  };

  const handleDecrease = () => decreaseQty(product._id);
  const handleIncrease = () => increaseQty(product._id);

  // dusre product pe jaao aur top pe scroll karo
  const goToProduct = (pid) => {
    navigate(`/product/${pid}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            <div className="lg:col-span-7">
              <div className="grid grid-cols-2 gap-3">
                <div className="aspect-square bg-gray-200 rounded-2xl" />
                <div className="aspect-square bg-gray-200 rounded-2xl" />
                <div className="aspect-square bg-gray-200 rounded-2xl" />
                <div className="aspect-square bg-gray-200 rounded-2xl" />
              </div>
            </div>
            <div className="lg:col-span-5 space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-10 bg-gray-200 rounded w-1/3 mt-6" />
              <div className="h-32 bg-gray-200 rounded mt-6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // error ya product nahi mila
  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center p-6 min-h-[calc(100vh-56px)] sm:min-h-[calc(100vh-64px)]">
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 max-w-md">
            <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h2 className="font-bold text-xl text-gray-800">Product not found</h2>
            <p className="text-gray-500 text-sm mt-1 mb-6">
              {error || 'This product may have been removed.'}
            </p>
            <button
              onClick={() => navigate('/shopList')}
              className="bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition cursor-pointer"
            >
              Back to Shop
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 lg:pb-0">

      {/* navbar — pure app me same */}
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">

        {/* main product section — left images, right info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

          {/* left — product images */}
          <div className="lg:col-span-7">

            {/* mobile — single image + thumbnails */}
            <div className="lg:hidden">
              <div className="relative bg-white rounded-2xl overflow-hidden border border-gray-100 mb-3">
                <img
                  src={product.images?.[selectedImage] || '/placeholder.png'}
                  alt={product.name}
                  className="w-full aspect-square object-cover cursor-zoom-in"
                  onClick={() => setShowFullImage(true)}
                  onError={(e) => (e.target.src = '/placeholder.png')}
                />
                {hasDiscount && (
                  <span className="absolute top-3 left-3 bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-lg shadow-md">
                    {discountPercent}% OFF
                  </span>
                )}
                {product.stock === 0 && (
                  <span className="absolute top-3 right-3 bg-gray-900 text-white text-sm font-semibold px-3 py-1.5 rounded-lg">
                    Out of stock
                  </span>
                )}
              </div>

              {product.images?.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition cursor-pointer ${selectedImage === i ? 'border-black' : 'border-gray-200'
                        }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* desktop — 2 column grid */}
            <div className="hidden lg:block">
              <div className="relative">
                <div className="grid grid-cols-2 gap-3">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setSelectedImage(i);
                        setShowFullImage(true);
                      }}
                      className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition cursor-pointer ${selectedImage === i
                        ? 'border-blue-500 shadow-lg'
                        : 'border-transparent hover:border-gray-300'
                        }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} ${i + 1}`}
                        className="w-full h-full object-cover cursor-zoom-in"
                      />
                      {i === 0 && hasDiscount && (
                        <span className="absolute top-3 left-3 bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-lg shadow-md">
                          {discountPercent}% OFF
                        </span>
                      )}
                      {i === 0 && product.stock === 0 && (
                        <span className="absolute top-3 right-3 bg-gray-900 text-white text-sm font-semibold px-3 py-1.5 rounded-lg">
                          Out of stock
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {/* floating wishlist + share */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
                  <button className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition cursor-pointer">
                    <Heart size={18} className="text-gray-700" />
                  </button>
                  <button className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition cursor-pointer">
                    <Share2 size={18} className="text-gray-700" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* right — product info (sticky) */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-20">

              {product.category && (
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {product.category}
                </span>
              )}

              <h1 className="text-xl sm:text-2xl lg:text-2xl font-semibold text-gray-900 leading-snug mt-2">
                {product.name}
              </h1>

              {/* rating */}
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center gap-1 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">
                  <span>4.8</span>
                  <Star size={12} className="fill-white" />
                </div>
                <span className="text-sm text-gray-500">2,797 Ratings & 124 Reviews</span>
              </div>

              {/* special price banner */}
              {hasDiscount && (
                <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-green-700">
                  <span className="bg-green-50 px-2 py-1 rounded">Special price</span>
                </div>
              )}

              {/* price */}
              <div className="flex items-baseline gap-3 mt-3 flex-wrap">
                <span className="text-3xl sm:text-4xl font-bold text-gray-900">
                  ₹{product.price}
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-lg line-through text-gray-400">
                      ₹{originalPrice}
                    </span>
                    <span className="text-lg font-bold text-green-600">
                      {discountPercent}% off
                    </span>
                  </>
                )}
              </div>

              <p className="text-xs text-gray-500 mt-1">+ Free delivery above ₹500</p>

              {/* offers box */}
              <div className="mt-5 border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 flex items-center gap-2">
                  <Tag size={14} />
                  Available Offers
                </div>
                <div className="p-4 space-y-3 bg-white">
                  <div className="flex gap-3">
                    <span className="text-blue-600 shrink-0 mt-0.5">🏦</span>
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Bank Offer:</span> 10% off on Axis Bank Credit Card, up to ₹1,500 on orders of ₹5,000 and above
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-blue-600 shrink-0 mt-0.5">💳</span>
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Bank Offer:</span> 5% Cashback on Flipkart Axis Bank Card
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-blue-600 shrink-0 mt-0.5">🎁</span>
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Special Price:</span> Get extra 10% off (price inclusive of cashback/coupon)
                    </p>
                  </div>
                </div>
              </div>

              {/* size selector */}
              {product.sizes?.length > 0 && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-gray-900">Select Size</p>
                    {sizeError && (
                      <p className="text-xs text-red-600 font-medium">Please select a size</p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => {
                          setSelectedSize(size);
                          setSizeError(false);
                        }}
                        className={`min-w-[52px] px-4 py-2.5 rounded-lg border-2 text-sm font-semibold transition cursor-pointer ${selectedSize === size
                          ? 'bg-black text-white border-black'
                          : sizeError
                            ? 'bg-white text-gray-700 border-red-300'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-black'
                          }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* stock status */}
              <div className="mt-5">
                {product.stock > 0 ? (
                  <p className="text-sm text-green-600 font-semibold">
                    ✓ In Stock ({product.stock} available)
                  </p>
                ) : (
                  <p className="text-sm text-red-600 font-semibold">
                    ✗ Currently Unavailable
                  </p>
                )}
              </div>

              {/* desktop — add to cart / buy now */}
              <div className="hidden lg:block mt-6">
                {product.stock === 0 ? (
                  <button
                    disabled
                    className="w-full py-4 rounded-lg font-semibold text-base bg-gray-100 text-gray-400 cursor-not-allowed"
                  >
                    Out of Stock
                  </button>
                ) : !inCart ? (
                  <div className="flex gap-3">
                    <button
                      onClick={handleAdd}
                      className="flex-1 flex items-center justify-center gap-2 py-4 rounded-lg font-semibold text-base bg-white border-2 border-black text-black hover:bg-gray-100 transition cursor-pointer"
                    >
                      <ShoppingCart size={18} /> Add to Cart
                    </button>
                    <button
                      onClick={handleBuyNow}
                      className="flex-1 flex items-center justify-center gap-2 py-4 rounded-lg font-semibold text-base bg-black text-white hover:bg-gray-800 transition cursor-pointer"
                    >
                      Buy Now
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="w-full flex items-center justify-between bg-black text-white rounded-lg overflow-hidden">
                      <button
                        onClick={handleDecrease}
                        className="px-6 py-4 hover:bg-gray-800 transition cursor-pointer"
                      >
                        <Minus size={18} />
                      </button>
                      <span className="flex-1 text-center font-bold text-lg">
                        {qty} in Cart
                      </span>
                      <button
                        onClick={handleIncrease}
                        disabled={qty >= product.stock}
                        className="px-6 py-4 hover:bg-gray-800 transition cursor-pointer disabled:opacity-40"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                    <button
                      onClick={handleBuyNow}
                      className="w-full py-4 rounded-lg font-semibold text-base bg-black text-white hover:bg-gray-800 transition cursor-pointer"
                    >
                      Go to Cart
                    </button>
                  </div>
                )}
              </div>

              {/* trust badges */}
              <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-gray-200">
                <div className="flex flex-col items-center text-center">
                  <Truck size={20} className="text-blue-600 mb-1" />
                  <p className="text-xs text-gray-600 font-medium">Free Delivery</p>
                  <p className="text-[10px] text-gray-400">Above ₹500</p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <RotateCcw size={20} className="text-green-600 mb-1" />
                  <p className="text-xs text-gray-600 font-medium">7 Day Returns</p>
                  <p className="text-[10px] text-gray-400">Easy & fast</p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <ShieldCheck size={20} className="text-purple-600 mb-1" />
                  <p className="text-xs text-gray-600 font-medium">Secure</p>
                  <p className="text-[10px] text-gray-400">100% safe</p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* product description */}
        <div className="mt-8 bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Product Description</h2>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* similar products — horizontal scroll */}
        {similarProducts.length > 0 && (
          <section className="mt-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Similar Products</h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                  More from {product.category}
                </p>
              </div>
              <button
                onClick={() => navigate('/shopList')}
                className="text-sm font-semibold text-gray-600 hover:text-black transition flex items-center gap-1 cursor-pointer"
              >
                View All <ChevronRight size={14} />
              </button>
            </div>

            <div
              ref={similarRef}
              className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide snap-x snap-mandatory scroll-smooth"
            >
              {similarProducts.map((p) => (
                <ProductMiniCard
                  key={p._id}
                  product={p}
                  onClick={() => goToProduct(p._id)}
                  addToCart={addToCart}
                  getQty={getQty}
                  increaseQty={increaseQty}
                  decreaseQty={decreaseQty}
                />
              ))}
              <div className="shrink-0 w-1" />
            </div>
          </section>
        )}

        {/* other products — grid */}
        {otherProducts.length > 0 && (
          <section className="mt-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">You May Also Like</h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                  Explore more from Oryanta
                </p>
              </div>
              <button
                onClick={() => navigate('/shopList')}
                className="text-sm font-semibold text-gray-600 hover:text-black transition flex items-center gap-1 cursor-pointer"
              >
                View All <ChevronRight size={14} />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {otherProducts.map((p) => (
                <ProductMiniCard
                  key={p._id}
                  product={p}
                  onClick={() => goToProduct(p._id)}
                  addToCart={addToCart}
                  getQty={getQty}
                  increaseQty={increaseQty}
                  decreaseQty={decreaseQty}
                  compact
                />
              ))}
            </div>
          </section>
        )}

      </div>

      {/* mobile — sticky bottom bar */}
      {product.stock > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 z-50 shadow-lg">
          {!inCart ? (
            <div className="flex gap-3">
              <button
                onClick={handleAdd}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-sm bg-white border-2 border-black text-black active:scale-95 transition"
              >
                <ShoppingCart size={16} /> Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-sm bg-black text-white active:scale-95 transition"
              >
                Buy Now
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <div className="flex-1 flex items-center justify-between bg-black text-white rounded-lg overflow-hidden">
                <button onClick={handleDecrease} className="px-4 py-3 active:bg-gray-800">
                  <Minus size={16} />
                </button>
                <span className="flex-1 text-center font-bold text-sm">{qty}</span>
                <button
                  onClick={handleIncrease}
                  disabled={qty >= product.stock}
                  className="px-4 py-3 active:bg-gray-800 disabled:opacity-40"
                >
                  <Plus size={16} />
                </button>
              </div>
              <button
                onClick={handleBuyNow}
                className="flex-1 py-3 rounded-lg font-semibold text-sm bg-black text-white active:scale-95 transition"
              >
                Go to Cart
              </button>
            </div>
          )}
        </div>
      )}

      {/* full screen image viewer */}
      {showFullImage && product.images?.length > 0 && (
        <FullScreenImageViewer
          images={product.images}
          initialIndex={selectedImage}
          onClose={() => setShowFullImage(false)}
          onIndexChange={(i) => setSelectedImage(i)}
        />
      )}
    </div>
  );
}

// full screen image viewer — flipkart style
function FullScreenImageViewer({ images, initialIndex = 0, onClose, onIndexChange }) {
  const [current, setCurrent] = useState(initialIndex);

  // parent ko current image batao
  useEffect(() => {
    if (onIndexChange) onIndexChange(current);
  }, [current, onIndexChange]);

  // keyboard + body scroll lock
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setCurrent((c) => (c + 1) % images.length);
      if (e.key === 'ArrowLeft') setCurrent((c) => (c - 1 + images.length) % images.length);
    };
    window.addEventListener('keydown', handleKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [images.length, onClose]);

  // mobile swipe
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };
  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].screenX;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) setCurrent((c) => (c + 1) % images.length);
      else setCurrent((c) => (c - 1 + images.length) % images.length);
    }
  };

  const goNext = () => setCurrent((c) => (c + 1) % images.length);
  const goPrev = () => setCurrent((c) => (c - 1 + images.length) % images.length);

  return (
    <div
      className="fixed inset-0 z-[100] bg-white flex flex-col"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* top bar — counter + close */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 shrink-0">
        <span className="text-sm font-medium text-gray-600">
          {current + 1} / {images.length}
        </span>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-100 transition cursor-pointer"
          title="Close (Esc)"
        >
          <X className="w-6 h-6 text-gray-800" />
        </button>
      </div>

      {/* image area + arrows */}
      <div className="flex-1 relative flex items-center justify-center bg-gray-50 overflow-hidden">
        {images.length > 1 && (
          <button
            onClick={goPrev}
            className="absolute left-2 sm:left-4 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition cursor-pointer"
            title="Previous (←)"
          >
            <ChevronLeft className="w-6 h-6 text-gray-800" />
          </button>
        )}

        <img
          src={images[current]}
          alt={`View ${current + 1}`}
          className="max-w-full max-h-full object-contain select-none"
          draggable={false}
          onError={(e) => (e.target.src = '/placeholder.png')}
        />

        {images.length > 1 && (
          <button
            onClick={goNext}
            className="absolute right-2 sm:right-4 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition cursor-pointer"
            title="Next (→)"
          >
            <ChevronRight className="w-6 h-6 text-gray-800" />
          </button>
        )}
      </div>

      {/* dots indicator */}
      {images.length > 1 && (
        <div className="shrink-0 py-4 bg-white border-t border-gray-100 flex items-center justify-center gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all cursor-pointer ${i === current ? 'w-6 h-2 bg-gray-800' : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                }`}
              title={`Go to image ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* thumbnail strip (desktop) */}
      {images.length > 1 && (
        <div className="hidden sm:flex shrink-0 bg-white border-t border-gray-100 px-4 py-3 gap-2 overflow-x-auto scrollbar-hide justify-center">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition cursor-pointer ${i === current ? 'border-gray-900' : 'border-gray-200 hover:border-gray-400'
                }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// chhota product card — similar/other products k liye
function ProductMiniCard({ product, onClick, addToCart, getQty, increaseQty, decreaseQty, compact }) {
  const qty = getQty(product._id);
  const inCart = qty > 0;
  const originalPrice = product.price + (product.discountPrice || 0);
  const hasDiscount = product.discountPrice > 0;

  const handleAdd = (e) => { e.stopPropagation(); addToCart(product, 1); };
  const handleDec = (e) => { e.stopPropagation(); decreaseQty(product._id); };
  const handleInc = (e) => { e.stopPropagation(); increaseQty(product._id); };

  return (
    <div
      onClick={onClick}
      className={`group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col ${compact ? 'w-full' : 'w-44 sm:w-52 shrink-0 snap-start'
        }`}
    >
      <div className="relative overflow-hidden bg-gray-100">
        <img
          src={product.images?.[0] || '/placeholder.png'}
          alt={product.name}
          className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => (e.target.src = '/placeholder.png')}
        />
        {hasDiscount && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">
            {Math.round((product.discountPrice / originalPrice) * 100)}% OFF
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute top-2 right-2 bg-gray-900 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">
            Sold out
          </span>
        )}
      </div>

      <div className="p-3 flex flex-col flex-1">
        <h3 className="font-semibold text-gray-900 text-sm truncate">{product.name}</h3>
        <div className="flex items-center gap-1.5 mt-1.5">
          <span className="font-bold text-gray-900 text-sm">₹{product.price}</span>
          {hasDiscount && (
            <span className="text-[11px] line-through text-gray-400">₹{originalPrice}</span>
          )}
        </div>

        {product.stock === 0 ? (
          <button disabled className="mt-2 w-full py-1.5 rounded-lg text-xs font-semibold bg-gray-100 text-gray-400 cursor-not-allowed">
            Out of Stock
          </button>
        ) : !inCart ? (
          <button
            onClick={handleAdd}
            className="mt-2 w-full flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-semibold bg-black text-white hover:bg-gray-800 transition cursor-pointer"
          >
            <Plus size={12} /> Add
          </button>
        ) : (
          <div
            onClick={(e) => e.stopPropagation()}
            className="mt-2 w-full flex items-center justify-between bg-black text-white rounded-lg overflow-hidden"
          >
            <button onClick={handleDec} className="px-2 py-1.5 cursor-pointer">
              <Minus size={12} />
            </button>
            <span className="flex-1 text-center font-bold text-xs">{qty}</span>
            <button
              onClick={handleInc}
              disabled={qty >= product.stock}
              className="px-2 py-1.5 cursor-pointer disabled:opacity-40"
            >
              <Plus size={12} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetail;