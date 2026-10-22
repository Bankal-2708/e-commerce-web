import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Trash2, Minus, Plus, 
  ShoppingBag, ShoppingCart, Truck, ShieldCheck,
} from 'lucide-react';
import { useCart } from '../../ContextAPI/CartContext/useCart';

// 🔥 Sub-component banaya taaki main Cart component saaf rahe
const CartItem = ({ item, navigate, decreaseQty, increaseQty, removeFromCart }) => {
  const itemTotal = item.price * item.quantity;
  const originalPrice = item.price + (item.discountPrice || 0);

  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100 flex flex-col sm:flex-row gap-4 items-start sm:items-center hover:shadow-sm transition">
      
      {/* Image */}
      <div onClick={() => navigate(`/product/${item._id}`)} className="shrink-0 cursor-pointer">
        <img
          src={item.images?.[0] || '/placeholder.png'}
          alt={item.name}
          className="w-24 h-24 object-cover rounded-xl bg-gray-100"
          onError={(e) => (e.target.src = '/placeholder.png')}
        />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0 w-full">
        <h3 onClick={() => navigate(`/product/${item._id}`)} className="font-semibold text-gray-900 truncate cursor-pointer hover:underline">
          {item.name}
        </h3>
        <p className="text-sm text-gray-500 truncate mt-0.5">{item.description}</p>
        
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <span className="font-bold text-gray-900">₹{item.price}</span>
          {item.discountPrice > 0 && (
            <span className="text-xs line-through text-gray-400">₹{originalPrice}</span>
          )}
        </div>
      </div>

      {/* 🔥 Controls (Mobile par neeche, Desktop par side mein - bina code duplicate kiye) */}
      <div className="flex items-center justify-between w-full sm:w-auto gap-4 mt-3 sm:mt-0">
        
        {/* Qty Buttons */}
        <div className="flex items-center bg-black text-white rounded-xl overflow-hidden">
          <button onClick={() => decreaseQty(item._id)} className="px-3 py-2 hover:bg-gray-800 transition cursor-pointer">
            <Minus size={14} />
          </button>
          <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
          <button 
            onClick={() => increaseQty(item._id)} 
            disabled={item.quantity >= item.stock}
            className="px-3 py-2 hover:bg-gray-800 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus size={14} />
          </button>
        </div>

        {/* Item Total */}
        <div className="font-bold text-gray-900 w-20 text-right sm:text-left">
          ₹{itemTotal}
        </div>

        {/* Remove */}
        <button 
          onClick={() => removeFromCart(item._id)} 
          className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition cursor-pointer shrink-0"
          title="Remove"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};


// Main Cart Component
const Cart = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, increaseQty, decreaseQty, clearCart, totalItems, totalPrice } = useCart();

  // Empty State
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 max-w-md w-full shadow-sm">
          <div className="w-24 h-24 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-6">
            <ShoppingBag className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="font-bold text-2xl text-gray-900">Your cart is empty</h2>
          <p className="text-gray-500 text-sm mt-2 mb-8">Looks like you haven't added anything yet. Start shopping to fill it up!</p>
          
          <button onClick={() => navigate('/shopList')} className="w-full bg-black text-white px-6 py-3.5 rounded-xl font-semibold hover:bg-gray-800 transition cursor-pointer">
            Continue Shopping
          </button>
          <button onClick={() => navigate(-1)} className="mt-3 w-full text-gray-600 py-2 text-sm font-medium hover:underline cursor-pointer">
            Go back
          </button>
        </div>
      </div>
    );
  }

  // Delivery charge — free above 500
  const deliveryCharge = totalPrice > 500 ? 0 : 60;
  const grandTotal = totalPrice + deliveryCharge;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-10 py-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2.5 rounded-xl bg-white border border-gray-200 hover:bg-gray-100 transition cursor-pointer" title="Back">
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Your Cart</h1>
              <p className="text-sm text-gray-500">{totalItems} {totalItems === 1 ? 'item' : 'items'} in cart</p>
            </div>
          </div>
          <button onClick={clearCart} className="text-sm font-medium text-red-600 hover:underline cursor-pointer">
            Clear all
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Side - Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <CartItem 
                key={item._id} 
                item={item} 
                navigate={navigate} 
                decreaseQty={decreaseQty} 
                increaseQty={increaseQty} 
                removeFromCart={removeFromCart} 
              />
            ))}

            <button onClick={() => navigate('/shopList')} className="w-full text-center py-3 text-sm font-medium text-gray-600 hover:text-black transition cursor-pointer">
              + Add more items
            </button>
          </div>

          {/* Right Side - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 lg:sticky lg:top-24">
              <h2 className="font-bold text-lg text-gray-900 mb-5">Order Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold text-gray-900">₹{totalPrice}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Delivery</span>
                  <span className="font-semibold">
                    {deliveryCharge === 0 ? <span className="text-green-600">FREE</span> : <span className="text-gray-900">₹{deliveryCharge}</span>}
                  </span>
                </div>
                {deliveryCharge > 0 && (
                  <p className="text-xs text-gray-500 bg-amber-50 border border-amber-100 rounded-lg p-2">
                    Add ₹{500 - totalPrice} more for FREE delivery 🚚
                  </p>
                )}
              </div>

              <div className="border-t border-gray-100 my-5" />

              <div className="flex items-center justify-between mb-6">
                <span className="font-bold text-lg text-gray-900">Total</span>
                <span className="font-bold text-xl text-gray-900">₹{grandTotal}</span>
              </div>

              <button onClick={() => navigate('/checkout')} className="w-full bg-black text-white py-3.5 rounded-xl font-semibold hover:bg-gray-800 transition cursor-pointer flex items-center justify-center gap-2">
                <ShoppingCart size={18} /> Proceed to Checkout
              </button>

              <div className="mt-5 space-y-3">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <ShieldCheck size={16} className="text-green-600 shrink-0" />
                  <span>Secure & encrypted checkout</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Truck size={16} className="text-blue-600 shrink-0" />
                  <span>Easy returns within 7 days</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Cart;