import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Package, ArrowLeft, Trash2, Edit } from 'lucide-react';

const API = '/api';

 
const apiCall = (url, options = {}) =>
  fetch(`${API}${url}`, { credentials: 'include', ...options }).then((res) => res.json());

function BrandPortal() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyProducts();
  }, []);

  const fetchMyProducts = async () => {
    setLoading(true);
    try {
      const data = await apiCall('/products/seller/me');
      data.success ? setProducts(data.products) : setError(data.message || 'Failed to load products');
    } catch {
      setError('Could not connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await apiCall(`/products/${id}`, { method: 'DELETE' });
      fetchMyProducts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate('/home')} className="p-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-100 transition">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Brand Portal 🏪</h1>
          <button onClick={() => navigate('/addProduct')} className="bg-black text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-gray-800 transition">
            <Plus size={18} /> Add Product
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-16 text-gray-500">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
            <Package className="w-14 h-14 mx-auto text-gray-300 mb-4" />
            <h3 className="font-semibold text-gray-800 text-lg">No products yet</h3>
            <p className="text-gray-500 text-sm mt-1 mb-6">Add your first product to start selling on Oryanta.</p>
            <button onClick={() => navigate('/addProduct')} className="bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition">
              + Add Your First Product
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {products.map((p) => (
              <div key={p._id} className="bg-white rounded-2xl p-4 border border-gray-100 flex gap-4 items-center">
                <img
                  src={p.images?.[0] || '/placeholder.png'}
                  alt={p.name}
                  className="w-24 h-24 object-cover rounded-xl bg-gray-100"
                  onError={(e) => (e.target.src = '/placeholder.png')}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{p.name}</h3>
                  <p className="text-sm text-gray-500 truncate">{p.description}</p>
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <span className="font-bold text-gray-900">₹{p.price}</span>
                    <span className="text-xs text-gray-500">Sizes: {p.sizes?.join(', ')}</span>
                    <span className="text-xs text-gray-400">Stock: {p.stock}</span>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => navigate(`/brand-portal/edit/${p._id}`)} className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition" title="Edit">
                    <Edit size={16} className="text-gray-700" />
                  </button>
                  <button onClick={() => handleDelete(p._id)} className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition" title="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default BrandPortal;