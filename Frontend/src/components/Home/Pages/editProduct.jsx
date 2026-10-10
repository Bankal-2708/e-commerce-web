import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload, X } from 'lucide-react';

const API = '/api';
const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];
const MAX_IMAGES = 6;
const MAX_TAGS = 10;

// input ki same class baar baar na likhni pade isliye
const inputCls = 'w-full px-4 py-3 border rounded-xl focus:border-black outline-none';

function EditProduct() {
  const { id } = useParams();   // url se product ki id nikalta h
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);   // data aane tk true
  const [saving, setSaving] = useState(false);    // save ke time true
  const [error, setError] = useState('');

  // sirf naye img ka state, purani img UI m nhi dikha rhe
  const [newImages, setNewImages] = useState([]);   // File objects
  const [previews, setPreviews] = useState([]);     // preview ke urls
  const previewsRef = useRef([]);                   // unmount pe cleanup ke liye

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    discountPrice: '',
    category: 'Unisex',
    sizes: [],
    tags: '',
    stock: 1,
  });

  // page khulte hi product ka data lao
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API}/products/${id}`);
        const data = await res.json();

        if (!data.success) throw new Error(data.message || 'Product not found');

        const p = data.product;

        // purana data form m bhar do
        setForm({
          name: p.name,
          description: p.description,
          price: p.price,
          discountPrice: p.discountPrice || '',   // 0 ho to empty dikhao
          category: p.category,
          sizes: p.sizes,
          tags: (p.tags || []).join(', '),         // array ko string bnaya input ke liye
          stock: p.stock,
        });

        // purani img ko state m save nhi kr rhe, kyuki UI m dikhani hi nhi
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // latest previews ref m rakhta h taaki unmount pe use ho ske
  useEffect(() => {
    previewsRef.current = previews;
  }, [previews]);

  // page chhodte time bache hue preview urls free kro (memory leak na ho)
  useEffect(() => () => previewsRef.current.forEach((u) => URL.revokeObjectURL(u)), []);

  // ek hi function se saare input update ho jate h
  const updateField = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  // naye img select krne pe
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    e.target.value = '';   // reset kiya taaki same file dubara select ho ske
    if (files.length + newImages.length > MAX_IMAGES) {
      return setError(`Maximum ${MAX_IMAGES} new images allowed`);
    }
    setNewImages((prev) => [...prev, ...files]);
    setPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
  };

  // naya img hatana h to
  const removeNewImage = (i) => {
    URL.revokeObjectURL(previews[i]);   // memory free
    setNewImages((prev) => prev.filter((_, idx) => idx !== i));
    setPreviews((prev) => prev.filter((_, idx) => idx !== i));
  };

  // size pe click kro to select, dubara kro to unselect
  const toggleSize = (size) => {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  // save changes pe click krne pe
  const handleSubmit = async (e) => {
    e.preventDefault();   // page reload na ho
    setError('');

    // pehle validation chek kro
    if (form.sizes.length === 0) return setError('Please select at least 1 size');

    const tagList = form.tags.split(',').map((t) => t.trim()).filter(Boolean);
    if (tagList.length > MAX_TAGS) return setError(`Maximum ${MAX_TAGS} tags allowed`);

    if (form.discountPrice && Number(form.discountPrice) >= Number(form.price)) {
      return setError('Discount price must be less than original price');
    }

    setSaving(true);
    try {
      // img bhejni h isliye FormData use kiya, json nhi
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        fd.append(k, Array.isArray(v) ? v.join(',') : v);   // sizes array ko comma wali string bnaya
      });

      // img tbhi bhejo jb user ne nayi select ki ho
      if (newImages.length > 0) {
        newImages.forEach((img) => fd.append('images', img));
      }

      // backend ko PUT request bhejo
      const res = await fetch(`${API}/products/${id}`, {
        method: 'PUT',
        credentials: 'include',   // cookie ke sath, login ke liye
        body: fd,
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Update failed');

      // ho gya to wapas brand portal pe
      navigate('/brand-portal');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);   // success ho ya fail button wapas enable
    }
  };

  // jb tk data nhi aata tb tk loading dikhao
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading product...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate('/brand-portal')}
            className="p-2 rounded-xl bg-white border cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">Edit Product</h1>
        </div>

        {/* error aaye to red box m dikhao */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border space-y-5">
          {/* yha pehle "Current Images" wala section tha, hata diya */}

          {/* naye img upload wala part */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Upload New Images (optional, max {MAX_IMAGES})
            </label>
            <p className="text-xs text-gray-400 mb-3">
              Leave empty to keep existing images
            </p>
            <div className="grid grid-cols-3 gap-3">
              {/* select kiye hue img ka preview + X button */}
              {previews.map((src, i) => (
                <div key={src} className="relative aspect-square">
                  <img
                    src={src}
                    alt={`Preview ${i + 1}`}
                    className="w-full h-full object-cover rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => removeNewImage(i)}
                    className="absolute top-1 right-1 bg-black/70 text-white p-1 rounded-full cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              {/* limit se kam img h tbhi add wala box dikhega */}
              {previews.length < MAX_IMAGES && (
                <label className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-black">
                  <Upload className="w-6 h-6 text-gray-400" />
                  <span className="text-xs text-gray-500 mt-1">Add</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold mb-1">Product Name *</label>
            <input type="text" required value={form.name} onChange={updateField('name')} className={inputCls} />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold mb-1">Description *</label>
            <textarea
              required
              rows={4}
              value={form.description}
              onChange={updateField('description')}
              className={`${inputCls} resize-none`}
            />
          </div>

          {/* price aur discount price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Price (₹) *</label>
              <input type="number" required min="0" value={form.price} onChange={updateField('price')} className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Discount Price (₹)</label>
              <input type="number" min="0" value={form.discountPrice} onChange={updateField('discountPrice')} className={inputCls} />
            </div>
          </div>

          {/* category aur stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Category</label>
              <select value={form.category} onChange={updateField('category')} className={inputCls}>
                {['Men', 'Women', 'Kids', 'Unisex', 'Accessories'].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Stock *</label>
              <input type="number" min="0" required value={form.stock} onChange={updateField('stock')} className={inputCls} />
            </div>
          </div>

          {/* sizes select krne wale buttons */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Available Sizes * (click to select)
            </label>
            <div className="flex flex-wrap gap-2">
              {ALL_SIZES.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleSize(size)}
                  className={`px-4 py-2 rounded-xl border font-medium text-sm transition cursor-pointer ${
                    form.sizes.includes(size)
                      ? 'bg-black text-white border-black'   // selected size
                      : 'bg-white text-gray-700 border-gray-300 hover:border-black'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* tags */}
          <div>
            <label className="block text-sm font-semibold mb-1">Tags (comma separated)</label>
            <input
              type="text"
              value={form.tags}
              onChange={updateField('tags')}
              className={inputCls}
              placeholder="e.g. casual, cotton, summer"
            />
          </div>

          {/* save button, saving ke time disable rhega */}
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-black text-white py-4 rounded-2xl font-semibold hover:bg-gray-800 disabled:bg-gray-400 transition cursor-pointer"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditProduct;