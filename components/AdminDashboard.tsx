import React, { useState } from 'react';
import { Product, Category, ShippingZone } from '../types.ts';
import { Trash2, Edit, Plus, Sparkles, TrendingUp, Share2, Package, MapPin } from 'lucide-react';
import { generateProductDescription, suggestMarketingPost } from '../services/geminiService.ts';

interface AdminDashboardProps {
  products: Product[];
  categories: Category[];
  shippingZones: ShippingZone[];
  onAddProduct: (p: Product) => void;
  onUpdateProduct: (p: Product) => void;
  onDeleteProduct: (id: string) => void;
  onUpdateZones: (zones: ShippingZone[]) => void;
}

// Mock data for the chart
const salesData = [
  { name: 'السبت', sales: 4000 },
  { name: 'الأحد', sales: 3000 },
  { name: 'الاثنين', sales: 2000 },
  { name: 'الثلاثاء', sales: 2780 },
  { name: 'الأربعاء', sales: 1890 },
  { name: 'الخميس', sales: 2390 },
  { name: 'الجمعة', sales: 3490 },
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  categories,
  shippingZones,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateZones
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'settings' | 'guide'>('products');
  const [isEditing, setIsEditing] = useState<Product | null>(null);
  
  // Form State for Product
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    price: 0,
    category: 'عام',
    description: '',
    image: 'https://picsum.photos/300/400',
    sizes: [],
    colors: [],
    stock: 10
  });

  // State for Shipping Zone Form
  const [zoneForm, setZoneForm] = useState({ wilaya: '', baladiya: '', price: 400 });

  const [loadingAI, setLoadingAI] = useState(false);
  const [marketingPopup, setMarketingPopup] = useState<string | null>(null);

  // --- Product Handlers ---
  const handleSaveProduct = () => {
    if (!formData.name || !formData.price) return;

    const generateId = () => {
      if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
      }
      return Date.now().toString(36) + Math.random().toString(36).substring(2);
    };

    const productToSave = {
      ...formData,
      id: isEditing ? isEditing.id : generateId(),
      sizes: formData.sizes || [],
      colors: formData.colors || [],
    } as Product;

    if (isEditing) {
      onUpdateProduct(productToSave);
    } else {
      onAddProduct(productToSave);
    }
    
    setIsEditing(null);
    resetProductForm();
  };

  const resetProductForm = () => {
    setFormData({
        name: '',
        price: 0,
        category: 'عام',
        description: '',
        image: 'https://picsum.photos/300/400',
        sizes: [],
        colors: [],
        stock: 10
    });
  };

  // --- Shipping Handlers ---
  const handleAddZone = () => {
      if (!zoneForm.wilaya || !zoneForm.price) return;
      const newZone: ShippingZone = {
          id: Date.now().toString(),
          wilaya: zoneForm.wilaya,
          baladiya: zoneForm.baladiya || 'الكل',
          price: Number(zoneForm.price)
      };
      onUpdateZones([...shippingZones, newZone]);
      setZoneForm({ wilaya: '', baladiya: '', price: 400 });
  };

  const handleDeleteZone = (id: string) => {
      onUpdateZones(shippingZones.filter(z => z.id !== id));
  };

  // --- AI Handlers ---
  const handleGenerateDescription = async () => {
    if (!formData.name) return alert("يرجى إدخال اسم المنتج أولاً");
    
    setLoadingAI(true);
    const desc = await generateProductDescription(
      formData.name, 
      formData.category || 'General', 
      'جودة عالية، سعر مناسب، تصميم عصري'
    );
    setFormData(prev => ({ ...prev, description: desc }));
    setLoadingAI(false);
  };

  const handleMarketingPost = async (productName: string) => {
    setLoadingAI(true);
    const post = await suggestMarketingPost(productName);
    setMarketingPopup(post);
    setLoadingAI(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Sub-header for Admin */}
      <div className="bg-white border-b px-4 py-4 mb-6">
        <div className="max-w-7xl mx-auto flex gap-4 overflow-x-auto no-scrollbar">
          <button 
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap ${activeTab === 'products' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            إدارة المنتجات
          </button>
          <button 
             onClick={() => setActiveTab('orders')}
             className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap ${activeTab === 'orders' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            الطلبات والإحصائيات
          </button>
          <button 
             onClick={() => setActiveTab('settings')}
             className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap ${activeTab === 'settings' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}
          >
             إعدادات الشحن (الولايات)
          </button>
          <button 
             onClick={() => setActiveTab('guide')}
             className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap ${activeTab === 'guide' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}
          >
             دليل الاستخدام
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        
        {/* Marketing Popup */}
        {marketingPopup && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <h3 className="font-bold text-lg mb-4">اقتراح تسويقي (AI)</h3>
              <textarea readOnly className="w-full h-32 p-2 bg-gray-100 rounded-lg mb-4" value={marketingPopup}></textarea>
              <div className="flex gap-2">
                <button onClick={() => {navigator.clipboard.writeText(marketingPopup); setMarketingPopup(null)}} className="flex-1 bg-primary text-white py-2 rounded-lg">نسخ وإغلاق</button>
                <button onClick={() => setMarketingPopup(null)} className="flex-1 bg-gray-200 py-2 rounded-lg">إلغاء</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm h-fit sticky top-24">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                {isEditing ? <Edit size={20}/> : <Plus size={20}/>}
                {isEditing ? 'تعديل المنتج' : 'إضافة منتج جديد'}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">اسم المنتج</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">السعر (د.ج)</label>
                    <input 
                      type="number" 
                      value={formData.price}
                      onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                      className="w-full border border-gray-300 rounded-lg p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">المخزون</label>
                    <input 
                      type="number" 
                      value={formData.stock}
                      onChange={e => setFormData({...formData, stock: Number(e.target.value)})}
                      className="w-full border border-gray-300 rounded-lg p-2"
                    />
                  </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">التصنيف</label>
                    <select 
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg p-2"
                    >
                      {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700">الوصف</label>
                    <button 
                      onClick={handleGenerateDescription}
                      disabled={loadingAI}
                      className="text-xs flex items-center gap-1 text-purple-600 hover:text-purple-700 font-bold disabled:opacity-50"
                    >
                      <Sparkles size={14} />
                      {loadingAI ? 'جارِ التوليد...' : 'توليد بالذكاء الاصطناعي'}
                    </button>
                  </div>
                  <textarea 
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                    placeholder="أدخل وصف المنتج..."
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">رابط الصورة</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={formData.image}
                      onChange={e => setFormData({...formData, image: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg p-2 text-sm text-left ltr" 
                    />
                    <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                       <img src={formData.image} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.currentTarget.src = 'https://via.placeholder.com/50'} />
                    </div>
                  </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">المقاسات (مفصولة بفاصلة)</label>
                    <input 
                        type="text" 
                        placeholder="S, M, L, XL"
                        value={formData.sizes?.join(', ')}
                        onChange={e => setFormData({...formData, sizes: e.target.value.split(',').map(s => s.trim()).filter(Boolean)})}
                        className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                    />
                </div>

                <div className="flex gap-2 pt-4">
                  <button 
                    onClick={handleSaveProduct}
                    className="flex-1 bg-primary text-white py-2 rounded-lg font-bold hover:bg-emerald-600 transition-colors"
                  >
                    {isEditing ? 'حفظ التعديلات' : 'إضافة المنتج'}
                  </button>
                  {isEditing && (
                    <button 
                      onClick={() => {setIsEditing(null); resetProductForm();}}
                      className="px-4 bg-gray-200 text-gray-700 rounded-lg"
                    >
                      إلغاء
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* List Section */}
            <div className="lg:col-span-2 space-y-4">
              {products.map(product => (
                <div key={product.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <img src={product.image} alt={product.name} className="w-20 h-20 object-cover rounded-lg" />
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800">{product.name}</h3>
                    <p className="text-sm text-gray-500">{product.category} • مخزون: {product.stock}</p>
                    <p className="font-bold text-primary mt-1">{product.price.toLocaleString()} د.ج</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleMarketingPost(product.name)}
                      className="p-2 text-purple-500 hover:bg-purple-50 rounded-lg"
                      title="تسويق ذكي"
                    >
                      <Share2 size={18} />
                    </button>
                    <button 
                      onClick={() => {setIsEditing(product); setFormData(product);}}
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => onDeleteProduct(product.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <TrendingUp className="text-primary" />
                      أداء المبيعات (تجريبي)
                  </h3>
                  <div className="h-64 w-full flex items-end justify-between gap-2 px-4 pb-4 border-b border-l border-gray-100">
                    {salesData.map((data, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-2 w-full group">
                        <div 
                          className="w-full bg-primary/20 hover:bg-primary transition-all rounded-t-md relative group-hover:shadow-lg" 
                          style={{ height: `${(data.sales / 4000) * 100}%`, minHeight: '4px' }}
                        >
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                            {data.sales} د.ج
                          </div>
                        </div>
                        <span className="text-xs text-gray-500 font-medium rotate-45 sm:rotate-0 mt-2">{data.name}</span>
                      </div>
                    ))}
                  </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                  <h3 className="text-lg font-bold mb-4">أحدث الطلبات</h3>
                  <div className="space-y-4 text-center py-8 text-gray-500">
                      <Package size={48} className="mx-auto mb-2 opacity-20" />
                      <p>لا توجد طلبات جديدة حالياً.</p>
                  </div>
              </div>
          </div>
        )}

        {activeTab === 'settings' && (
            <div className="bg-white p-6 rounded-2xl shadow-sm max-w-2xl mx-auto">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <MapPin className="text-primary" />
                    إعدادات التوصيل (الولايات)
                </h3>
                
                {/* Add Zone Form */}
                <div className="bg-gray-50 p-4 rounded-xl mb-6">
                    <h4 className="font-bold text-sm mb-3">إضافة منطقة جديدة</h4>
                    <div className="grid grid-cols-3 gap-3">
                        <input 
                            type="text" 
                            placeholder="الولاية (مثال: الجزائر)" 
                            className="p-2 rounded-lg border border-gray-200 text-sm"
                            value={zoneForm.wilaya}
                            onChange={e => setZoneForm({...zoneForm, wilaya: e.target.value})}
                        />
                         <input 
                            type="number" 
                            placeholder="السعر" 
                            className="p-2 rounded-lg border border-gray-200 text-sm"
                            value={zoneForm.price}
                            onChange={e => setZoneForm({...zoneForm, price: Number(e.target.value)})}
                        />
                        <button 
                            onClick={handleAddZone}
                            className="bg-secondary text-white rounded-lg text-sm font-bold hover:bg-slate-800"
                        >
                            إضافة
                        </button>
                    </div>
                </div>

                <div className="space-y-3">
                    {shippingZones.map(zone => (
                         <div key={zone.id} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg shadow-sm">
                            <div>
                                <span className="font-bold text-gray-800">{zone.wilaya}</span>
                                <span className="text-gray-400 text-xs mx-2">|</span>
                                <span className="text-sm text-gray-500">{zone.baladiya}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="font-bold text-primary">{zone.price} د.ج</span>
                                <button 
                                    onClick={() => handleDeleteZone(zone.id)}
                                    className="text-red-400 hover:text-red-600 text-sm"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {shippingZones.length === 0 && (
                        <div className="text-center py-4 text-gray-400 text-sm">لا توجد مناطق توصيل مضافة.</div>
                    )}
                </div>
            </div>
        )}

        {activeTab === 'guide' && (
             <div className="bg-white p-8 rounded-2xl shadow-sm max-w-3xl mx-auto prose prose-lg text-gray-600">
                 <h2 className="text-2xl font-bold text-secondary mb-4">دليل إدارة متجرك</h2>
                 <ul className="list-disc space-y-2 pr-5">
                     <li><strong>إضافة المنتجات:</strong> استخدم تبويب "إدارة المنتجات". تأكد من إضافة صور جذابة ووصف دقيق. يمكنك استخدام زر "الذكاء الاصطناعي" لكتابة وصف احترافي.</li>
                     <li><strong>المقاسات والألوان:</strong> افصل بين المقاسات بفواصل (مثل: S, M, L). ستظهر كأزرار اختيار للعميل.</li>
                     <li><strong>مناطق الشحن:</strong> انتقل لتبويب "إعدادات الشحن" لإضافة الولايات وأسعار التوصيل الخاصة بكل منطقة. ستظهر هذه الخيارات للعميل عند إتمام الطلب.</li>
                 </ul>
             </div>
        )}
      </div>
    </div>
  );
};