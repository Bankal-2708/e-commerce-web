import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Package, ArrowLeft, Trash2, Edit, AlertTriangle } from 'lucide-react';

const API = '/api';

// API call ka common helper
const apiCall = (url, options = {}) =>
  fetch(`${API}${url}`, { credentials: 'include', ...options }).then((res) => res.json());

function BrandPortal() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Delete modal ke liye state
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchMyProducts();
  }, []);

  const fetchMyProducts = async () => {
    setLoading(true);
    try {
      const data = await apiCall('/products/seller/me');
      if (data.success) {
        setProducts(data.products);
      } else {
        throw new Error(data.message || 'Failed to load products');
      }
    } catch (err) {
      setError(err.message || 'Could not connect to server');
    } finally {
      setLoading(false);
    }
  };

  // Delete confirm karne par
  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    setError(''); // purana error clear kro

    try {
      const data = await apiCall(`/products/${deleteId}`, { method: 'DELETE' });
      if (!data.success) throw new Error(data.message || 'Delete failed');
      
      setDeleteId(null); // modal band karo
      fetchMyProducts(); // list refresh karo
    } catch (err) {
      setError(err.message);
      setDeleteId(null); // error aaye to bhi modal band karo
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6 gap-2">
          <button
            onClick={() => navigate('/home')}
            className="p-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-100 transition cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">Brand Portal 🏪</h1>
          <button
            onClick={() => navigate('/addProduct')}
            className="bg-black text-white px-3 sm:px-4 py-2 rounded-xl flex items-center gap-1.5 sm:gap-2 hover:bg-gray-800 transition cursor-pointer shrink-0"
          >
            <Plus size={18} /> <span className="hidden sm:inline">Add Product</span>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* Main Content */}
        {loading ? (
          <div className="text-center py-16 text-gray-500">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 sm:p-12 text-center border border-gray-100">
            <Package className="w-14 h-14 mx-auto text-gray-300 mb-4" />
            <h3 className="font-semibold text-gray-800 text-lg">No products yet</h3>
            <p className="text-gray-500 text-sm mt-1 mb-6">Add your first product to start selling on Oryanta.</p>
            <button
              onClick={() => navigate('/addProduct')}
              className="bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition cursor-pointer"
            >
              + Add Your First Product
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {products.map((p) => {
              // Original price nikalne ka sahi tarika (NaN bug fix)
              const originalPrice = p.price + (p.discountPrice || 0);

              return (
                <div key={p._id} className="bg-white rounded-2xl p-4 border border-gray-100 flex flex-col sm:flex-row gap-4 items-start sm:items-center hover:shadow-sm transition">
                  
                  {/* Image */}
                  <img
                    src={p.images?.[0] || '/placeholder.png'}
                    alt={p.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl bg-gray-100 shrink-0"
                    onError={(e) => (e.target.src = '/placeholder.png')}
                  />

                  {/* Details */}
                  <div className="flex-1 min-w-0 w-full">
                    <h3 className="font-semibold text-gray-900 truncate">{p.name}</h3>
                    <p className="text-sm text-gray-500 truncate">{p.description}</p>
                    
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      <span className="font-semibold text-gray-900">₹{p.price}</span>
                      
                      {/* Sirf tab line-through dikhao jab discount ho */}
                      {p.discountPrice > 0 && (
                        <span className="text-sm line-through text-gray-400">₹{originalPrice}</span>
                      )}
                      
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">Sizes: {p.sizes?.join(', ') || 'N/A'}</span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">Stock: {p.stock}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 shrink-0 w-full sm:w-auto justify-end mt-2 sm:mt-0">
                    <button
                      onClick={() => navigate(`/editProduct/${p._id}`)}
                      className="p-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition cursor-pointer"
                      title="Edit"
                    >
                      <Edit size={16} className="text-gray-700" />
                    </button>
                    <button
                      onClick={() => setDeleteId(p._id)}
                      className="p-2.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => !isDeleting && setDeleteId(null)} // Deleting ke time modal band na ho
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()} // Andar click karne pe modal band na ho
          >
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mx-auto mb-5">
              <AlertTriangle className="w-8 h-8 text-red-600" strokeWidth={2.2} />
            </div>

            <h3 className="text-lg font-bold text-gray-900 text-center mb-2">Delete this product?</h3>
            <p className="text-sm text-gray-500 text-center mb-7 leading-relaxed">
              This action cannot be undone. The product will be permanently removed from your store.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                disabled={isDeleting}
                className="flex-1 py-3 rounded-xl border border-gray-300 font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex-1 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BrandPortal;