import React, { useState, useEffect } from 'react';
import { Product, CartItem, Category, ShippingZone } from './types.ts';
import { Navbar } from './components/Navbar.tsx';
import { ProductCard } from './components/ProductCard.tsx';
import { ProductDetails } from './components/ProductDetails.tsx';
import { CartDrawer } from './components/CartDrawer.tsx';
import { AdminDashboard } from './components/AdminDashboard.tsx';
import { Facebook, Instagram, Phone, Mail, Lock, ArrowRight } from 'lucide-react';

// Initial Mock Data
const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'ساعة ذكية ألترا برو',
    price: 4500,
    category: 'إلكترونيات',
    description: 'ساعة ذكية مقاومة للماء مع بطارية تدوم طويلاً وشاشة AMOLED عالية الدقة. تدعم جميع الهواتف.',
    image: 'https://picsum.photos/id/175/400/500',
    sizes: [],
    colors: ['black', 'orange', 'gray'],
    stock: 20
  },
  {
    id: '2',
    name: 'حذاء رياضي مريح',
    price: 3200,
    category: 'ملابس',
    description: 'حذاء رياضي للجري بتصميم عصري وخامات مريحة للقدمين.',
    image: 'https://picsum.photos/id/21/400/500',
    sizes: ['39', '40', '41', '42', '43', '44'],
    colors: ['white', 'black'],
    stock: 15
  },
  {
    id: '3',
    name: 'عطر فاخر (عود ملكي)',
    price: 2800,
    category: 'عطور',
    description: 'عطر شرقي أصيل برائحة العود والمسك، ثبات عالي يدوم لأكثر من 24 ساعة.',
    image: 'https://picsum.photos/id/312/400/500',
    sizes: ['50ml', '100ml'],
    colors: [],
    stock: 50
  },
  {
    id: '4',
    name: 'حقيبة جلدية للأعمال',
    price: 5600,
    category: 'إكسسوارات',
    description: 'حقيبة مصنوعة من الجلد الطبيعي، مناسبة للعمل وحمل اللابتوب.',
    image: 'https://picsum.photos/id/36/400/500',
    sizes: [],
    colors: ['brown', 'black'],
    stock: 5
  }
];

const CATEGORIES: Category[] = [
    { id: '1', name: 'إلكترونيات' },
    { id: '2', name: 'ملابس' },
    { id: '3', name: 'عطور' },
    { id: '4', name: 'إكسسوارات' },
    { id: '5', name: 'منزل' },
    { id: '6', name: 'عام' }
];

const INITIAL_ZONES: ShippingZone[] = [
  { id: '1', wilaya: 'الجزائر', baladiya: 'الكل', price: 400 },
  { id: '2', wilaya: 'وهران', baladiya: 'الكل', price: 600 },
  { id: '3', wilaya: 'قسنطينة', baladiya: 'الكل', price: 600 },
  { id: '4', wilaya: 'الجنوب', baladiya: 'الكل', price: 900 },
];

function App() {
  // State
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [shippingZones, setShippingZones] = useState<ShippingZone[]>(INITIAL_ZONES);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Auth State
  const [isAdminMode, setAdminMode] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(false);
  
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Load cart from local storage
  useEffect(() => {
    const savedCart = localStorage.getItem('souq-cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart
  useEffect(() => {
    localStorage.setItem('souq-cart', JSON.stringify(cart));
  }, [cart]);

  // Handlers
  const addToCart = (product: Product, size?: string, color?: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && item.selectedSize === size && item.selectedColor === color);
      if (existing) {
        return prev.map(item => 
          (item.id === product.id && item.selectedSize === size && item.selectedColor === color)
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { ...product, quantity: 1, selectedSize: size, selectedColor: color }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const handleAddProduct = (newProduct: Product) => {
    setProducts(prev => [newProduct, ...prev]);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const handleDeleteProduct = (id: string) => {
    if(window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
        setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  // --- Auth Handlers ---
  const handleAdminClick = () => {
    if (isAdminMode) return;
    setShowLoginModal(true);
    setPasswordInput('');
    setLoginError(false);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Hardcoded password for demo
    if (passwordInput === 'admin123') {
      setAdminMode(true);
      setShowLoginModal(false);
      setPasswordInput('');
    } else {
      setLoginError(true);
    }
  };

  const handleLogout = () => {
    setAdminMode(false);
  };

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar 
        cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)} 
        toggleCart={() => setIsCartOpen(!isCartOpen)}
        isAdminMode={isAdminMode}
        onAdminClick={handleAdminClick}
        onLogout={handleLogout}
      />

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowLoginModal(false)}></div>
          <div className="bg-white rounded-2xl w-full max-w-md p-8 relative z-10 shadow-2xl animate-fade-in">
            <div className="flex flex-col items-center mb-6">
               <div className="bg-primary/10 p-3 rounded-full text-primary mb-3">
                 <Lock size={32} />
               </div>
               <h2 className="text-2xl font-bold text-gray-800">تسجيل دخول المدير</h2>
               <p className="text-gray-500 text-sm mt-1">أدخل كلمة المرور للوصول للوحة التحكم</p>
            </div>
            
            <form onSubmit={handleLoginSubmit}>
               <div className="mb-4">
                 <input 
                   type="password"
                   placeholder="كلمة المرور"
                   autoFocus
                   className={`w-full border rounded-xl p-3 outline-none focus:ring-2 transition-all ${loginError ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-primary/50'}`}
                   value={passwordInput}
                   onChange={e => {setPasswordInput(e.target.value); setLoginError(false)}}
                 />
                 {loginError && <p className="text-red-500 text-xs mt-2 font-bold">كلمة المرور غير صحيحة</p>}
               </div>
               <button 
                 type="submit"
                 className="w-full bg-secondary text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
               >
                 دخول
                 <ArrowRight size={18} />
               </button>
            </form>
            <button 
              onClick={() => setShowLoginModal(false)}
              className="w-full mt-3 text-gray-500 hover:text-gray-700 text-sm font-medium py-2"
            >
              إلغاء
            </button>
          </div>
        </div>
      )}

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cart} 
        removeFromCart={removeFromCart}
        shippingZones={shippingZones}
        onClearCart={clearCart}
      />

      {selectedProduct && (
        <ProductDetails 
          product={selectedProduct} 
          isOpen={!!selectedProduct} 
          onClose={() => setSelectedProduct(null)}
          onAddToCart={addToCart}
        />
      )}

      <main className="flex-grow">
        {isAdminMode ? (
          <AdminDashboard 
            products={products}
            categories={CATEGORIES}
            shippingZones={shippingZones}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            onUpdateZones={setShippingZones}
          />
        ) : (
          // Store Front
          <div className="max-w-7xl mx-auto px-4 py-8">
            
            {/* Hero Banner (Static) */}
            <div className="bg-secondary rounded-3xl p-8 md:p-12 text-white mb-12 flex items-center justify-between relative overflow-hidden">
              <div className="relative z-10 max-w-lg">
                <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-bold mb-4 inline-block border border-primary/30">عروض حصرية</span>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">تسوّق أحدث المنتجات بأفضل الأسعار</h1>
                <p className="text-gray-300 mb-8 text-lg">تشكيلة واسعة من الملابس، الإلكترونيات، والعطور الفاخرة مع توصيل سريع لجميع الولايات.</p>
                <button className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-primary/30">
                  تصفح العروض
                </button>
              </div>
              <div className="hidden md:block relative z-10">
                  <div className="w-64 h-64 bg-gradient-to-tr from-primary to-emerald-300 rounded-full blur-3xl opacity-20 absolute -top-10 -left-10"></div>
                  <img src="https://picsum.photos/id/160/300/300" className="rounded-2xl shadow-2xl rotate-3 border-4 border-white/10" alt="Hero" />
              </div>
            </div>

            {/* Categories Filter */}
            <div className="flex gap-3 overflow-x-auto pb-6 no-scrollbar">
               <button 
                 onClick={() => setSelectedCategory('all')}
                 className={`px-6 py-2 rounded-full whitespace-nowrap transition-colors ${selectedCategory === 'all' ? 'bg-secondary text-white' : 'bg-white border hover:bg-gray-50'}`}
               >
                 الكل
               </button>
               {CATEGORIES.map(cat => (
                 <button 
                   key={cat.id}
                   onClick={() => setSelectedCategory(cat.name)}
                   className={`px-6 py-2 rounded-full whitespace-nowrap transition-colors ${selectedCategory === cat.name ? 'bg-secondary text-white' : 'bg-white border hover:bg-gray-50'}`}
                 >
                   {cat.name}
                 </button>
               ))}
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
              {filteredProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onOpen={setSelectedProduct}
                />
              ))}
            </div>

            {filteredProducts.length === 0 && (
                <div className="text-center py-20 text-gray-500">
                    لا توجد منتجات في هذا التصنيف حالياً.
                </div>
            )}
          </div>
        )}
      </main>

      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold text-secondary mb-4">سوق برو</h3>
              <p className="text-gray-500 mb-4">منصتك الأولى للتسوق الإلكتروني. نوفر لك أفضل المنتجات بجودة عالية وأسعار منافسة.</p>
              <div className="flex gap-4">
                <a href="#" className="bg-blue-50 text-blue-600 p-2 rounded-full hover:bg-blue-100"><Facebook size={20}/></a>
                <a href="#" className="bg-pink-50 text-pink-600 p-2 rounded-full hover:bg-pink-100"><Instagram size={20}/></a>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-secondary mb-4">روابط سريعة</h3>
              <ul className="space-y-2 text-gray-500 text-sm">
                <li><a href="#" className="hover:text-primary">من نحن</a></li>
                <li><a href="#" className="hover:text-primary">سياسة الخصوصية</a></li>
                <li><a href="#" className="hover:text-primary">الشروط والأحكام</a></li>
                <li><a href="#" className="hover:text-primary">اتصل بنا</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-secondary mb-4">تواصل معنا</h3>
              <div className="space-y-3 text-gray-500 text-sm">
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-primary"/>
                  <span>+213 555 123 456</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-primary"/>
                  <span>contact@souqpro.com</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-gray-400">
            © {new Date().getFullYear()} SouqPro. جميع الحقوق محفوظة.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;