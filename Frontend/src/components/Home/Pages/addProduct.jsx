import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, X } from 'lucide-react';

const API = '/api';
const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];
const MAX_IMAGES = 6;
const MAX_TAGS = 10;

function AddProduct() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);

  const [form, setForm] = useState({
    name: '', description: '', price: '', discountPrice: '',
    category: 'Unisex', sizes: [], tags: '', stock: 1,
  });

  // Cleanup blob URLs when component unmounts (memory leak fix)
  useEffect(() => {
    return () => previews.forEach(URL.revokeObjectURL);
  }, [previews]);

  const updateField = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > MAX_IMAGES) {
      setError(`Maximum ${MAX_IMAGES} images allowed`);
      e.target.value = ''; // allow re-selecting same file later
      return;
    }
    setImages(prev => [...prev, ...files]);
    setPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
    e.target.value = ''; // fix: allows re-selecting the same file
  };

  const removeImage = (i) => {
    URL.revokeObjectURL(previews[i]); // free memory immediately
    setImages(prev => prev.filter((_, idx) => idx !== i));
    setPreviews(prev => prev.filter((_, idx) => idx !== i));
  };

  const toggleSize = (size) => {
    setForm(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (images.length === 0) return setError('Please upload at least 1 image');
    if (form.sizes.length === 0) return setError('Please select at least 1 size');

    const tagList = form.tags.split(',').map(t => t.trim()).filter(Boolean);
    if (tagList.length > MAX_TAGS) return setError(`Maximum ${MAX_TAGS} tags allowed`);

    if (form.discountPrice && Number(form.discountPrice) >= Number(form.price)) {
      return setError('Discount price must be less than the original price');
    }

    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        fd.append(k, Array.isArray(v) ? v.join(',') : v);
      });
      images.forEach(img => fd.append('images', img));

      const res = await fetch(`${API}/products`, {
        method: 'POST',
        credentials: 'include',
        body: fd,
      });
      const data = await res.json();

      if (!res.ok || !data.success) throw new Error(data.message || 'Failed');
      navigate('/brand-portal');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate('/brand-portal')} className="p-2 rounded-xl bg-white border">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">Add New Product</h1>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border space-y-5">
          {/* Images */}
          <div>
            <label className="block text-sm font-semibold mb-2">Product Images (max {MAX_IMAGES})</label>
            <div className="grid grid-cols-3 gap-3">
              {previews.map((src, i) => (
                <div key={src} className="relative aspect-square">
                  <img src={src} className="w-full h-full object-cover rounded-xl" alt={`Preview ${i + 1}`} />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 bg-black/70 text-white p-1 rounded-full"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              {previews.length < MAX_IMAGES && (
                <label className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-black">
                  <Upload className="w-6 h-6 text-gray-400" />
                  <span className="text-xs text-gray-500 mt-1">Add</span>
                  <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
                </label>
              )}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold mb-1">Product Name *</label>
            <input
              type="text" required value={form.name} onChange={updateField('name')}
              className="w-full px-4 py-3 border rounded-xl focus:border-black outline-none"
              placeholder="e.g. Cotton Casual Shirt"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold mb-1">Description *</label>
            <textarea
              required rows={4} value={form.description} onChange={updateField('description')}
              className="w-full px-4 py-3 border rounded-xl focus:border-black outline-none resize-none"
              placeholder="Fabric, fit, care instructions..."
            />
          </div>

          {/* Price Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Price (₹) *</label>
              <input
                type="number" required min="0" value={form.price} onChange={updateField('price')}
                className="w-full px-4 py-3 border rounded-xl focus:border-black outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Discount Price (₹)</label>
              <input
                type="number" min="0" value={form.discountPrice} onChange={updateField('discountPrice')}
                className="w-full px-4 py-3 border rounded-xl focus:border-black outline-none"
                placeholder="Optional"
              />
            </div>
          </div>

          {/* Category + Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Category</label>
              <select
                value={form.category} onChange={updateField('category')}
                className="w-full px-4 py-3 border rounded-xl focus:border-black outline-none"
              >
                {['Men', 'Women', 'Kids', 'Unisex', 'Accessories'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Stock *</label>
              <input
                type="number" min="0" required value={form.stock} onChange={updateField('stock')}
                className="w-full px-4 py-3 border rounded-xl focus:border-black outline-none"
              />
            </div>
          </div>

          {/* Sizes */}
          <div>
            <label className="block text-sm font-semibold mb-2">Available Sizes * (click to select)</label>
            <div className="flex flex-wrap gap-2">
              {ALL_SIZES.map(size => (
                <button
                  key={size} type="button" onClick={() => toggleSize(size)}
                  className={`px-4 py-2 rounded-xl border font-medium text-sm transition ${
                    form.sizes.includes(size)
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-black'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-semibold mb-1">Tags (comma separated)</label>
            <input
              type="text" value={form.tags} onChange={updateField('tags')}
              className="w-full px-4 py-3 border rounded-xl focus:border-black outline-none"
              placeholder="e.g. casual, cotton, summer"
            />
            <p className="text-xs text-gray-400 mt-1">Max {MAX_TAGS} tags</p>
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full bg-black text-white py-4 rounded-2xl font-semibold hover:bg-gray-800 disabled:bg-gray-400 transition"
          >
            {loading ? 'Uploading...' : 'Publish Product'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;