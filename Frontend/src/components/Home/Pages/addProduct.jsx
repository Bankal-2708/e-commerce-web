import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, X } from 'lucide-react';

const API = '/api';
const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];
const MAX_IMAGES = 6;
const MAX_TAGS = 10;

// input ki same class baar baar na likhni pade isliye
const inputCls = 'w-full px-4 py-3 border rounded-xl focus:border-black outline-none';

function AddProduct() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // images aur unke previews ek sath rakh liye (sync easy hota h)
  const [images, setImages] = useState([]); // { file, preview } object store krega
  const imagesRef = useRef([]); // cleanup ke liye

  const [form, setForm] = useState({
    name: '', description: '', price: '', discountPrice: '',
    category: 'Unisex', sizes: [], tags: '', stock: 1,
  });

  // latest images ref m rakhta h taaki unmount pe use ho ske
  useEffect(() => { imagesRef.current = images; }, [images]);
  
  // unmount hote waqt memory free karo (yha bina ref k bug aayega)
  useEffect(() => () => imagesRef.current.forEach((img) => URL.revokeObjectURL(img.preview)), []);

  // Ek hi function se saare inputs handle ho jayenge (name attribute use karke)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // naye images select krne pe
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    e.target.value = ''; // reset taaki same image dubara select ho ske

    if (files.length + images.length > MAX_IMAGES) {
      return setError(`Maximum ${MAX_IMAGES} images allowed`);
    }

    const newImgs = files.map((file) => ({ file, preview: URL.createObjectURL(file) }));
    setImages((prev) => [...prev, ...newImgs]);
    setError(''); // error clear kar do
  };

  // image hatana
  const removeImage = (i) => {
    URL.revokeObjectURL(images[i].preview); // memory free
    setImages((prev) => prev.filter((_, idx) => idx !== i));
  };

  // size select/unselect toggle
  const toggleSize = (size) => {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  // Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault(); // page reload na ho
    setError('');

    // validations
    if (images.length === 0) return setError('Please upload at least 1 image');
    if (form.sizes.length === 0) return setError('Please select at least 1 size');

    const tagList = form.tags.split(',').map((t) => t.trim()).filter(Boolean);
    if (tagList.length > MAX_TAGS) return setError(`Maximum ${MAX_TAGS} tags allowed`);
    if (form.discountPrice && Number(form.discountPrice) >= Number(form.price)) {
      return setError('Discount price must be less than the original price');
    }

    setLoading(true);
    try {
      // img bhejni h isliye FormData use kiya
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        fd.append(k, Array.isArray(v) ? v.join(',') : v);
      });
      images.forEach((img) => fd.append('images', img.file));

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
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate('/brand-portal')} className="p-2 rounded-xl bg-white border cursor-pointer hover:bg-gray-50 transition">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">Add New Product</h1>
        </div>

        {/* Error Box */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border space-y-5">
          
          {/* Images Upload Section */}
          <div>
            <label className="block text-sm font-semibold mb-2">Product Images (max {MAX_IMAGES})</label>
            <div className="grid grid-cols-3 gap-3">
              {images.map((img, i) => (
                <div key={img.preview} className="relative aspect-square">
                  <img src={img.preview} className="w-full h-full object-cover rounded-xl" alt={`Preview ${i + 1}`} />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 bg-black/70 text-white p-1 rounded-full cursor-pointer hover:bg-black transition"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              
              {/* limit se kam img h tbhi add wala box dikhega */}
              {images.length < MAX_IMAGES && (
                <label className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-black transition">
                  <Upload className="w-6 h-6 text-gray-400" />
                  <span className="text-xs text-gray-500 mt-1">Add</span>
                  <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
                </label>
              )}
            </div>
          </div>

          {/* Name Input (name attribute use kiya) */}
          <div>
            <label className="block text-sm font-semibold mb-1">Product Name *</label>
            <input type="text" name="name" required value={form.name} onChange={handleChange} className={inputCls} placeholder="e.g. Cotton Casual Shirt" />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold mb-1">Description *</label>
            <textarea name="description" required rows={4} value={form.description} onChange={handleChange} className={`${inputCls} resize-none`} placeholder="Fabric, fit, care instructions..." />
          </div>

          {/* Price and Discount */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Price (₹) *</label>
              <input type="number" name="price" required min="0" value={form.price} onChange={handleChange} className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Discount Price (₹)</label>
              <input type="number" name="discountPrice" min="0" value={form.discountPrice} onChange={handleChange} className={inputCls} placeholder="Optional" />
            </div>
          </div>

          {/* Category and Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Category</label>
              <select name="category" value={form.category} onChange={handleChange} className={inputCls}>
                {['Men', 'Women', 'Kids', 'Unisex', 'Accessories'].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Stock *</label>
              <input type="number" name="stock" min="0" required value={form.stock} onChange={handleChange} className={inputCls} />
            </div>
          </div>

          {/* Sizes Toggle */}
          <div>
            <label className="block text-sm font-semibold mb-2">Available Sizes * (click to select)</label>
            <div className="flex flex-wrap gap-2">
              {ALL_SIZES.map((size) => (
                <button
                  key={size} type="button" onClick={() => toggleSize(size)}
                  className={`px-4 py-2 rounded-xl border font-medium text-sm transition cursor-pointer ${
                    form.sizes.includes(size) ? 'bg-black text-white border-black' : 'bg-white text-gray-700 border-gray-300 hover:border-black'
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
            <input type="text" name="tags" value={form.tags} onChange={handleChange} className={inputCls} placeholder="e.g. casual, cotton, summer" />
            <p className="text-xs text-gray-400 mt-1">Max {MAX_TAGS} tags</p>
          </div>

          {/* Submit Button */}
          <button type="submit" disabled={loading} className="w-full bg-black text-white py-4 rounded-2xl font-semibold hover:bg-gray-800 disabled:bg-gray-400 transition cursor-pointer">
            {loading ? 'Uploading...' : 'Publish Product'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;