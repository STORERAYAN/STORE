/**
 * المحرك الأساسي لمتجر ك - script.js
 * يشمل: إدارة السلة، مزامنة الحساب، عرض المنتجات، والتنبيهات الاحترافية
 */

// --- 1. الإعدادات والمتغيرات العامة ---
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// --- 2. نظام مزامنة الحساب (تسجيل الدخول/الخروج) ---

function syncAuthStatus() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const authBtn = document.getElementById('auth-btn'); // يجب أن يكون معرف زر الدخول في كل الصفحات
    
    if (user && authBtn) {
        // إذا كان المستخدم مسجلاً، نقوم بتغيير الزر إلى زر خروج أنيق
        authBtn.innerHTML = `<i class="fas fa-sign-out-alt"></i> خروج (${user.email.split('@')[0]})`;
        authBtn.classList.add('logout-style');
        authBtn.href = "#";
        
        authBtn.onclick = function(e) {
            e.preventDefault();
            logoutUser();
        };
    }
}

function logoutUser() {
    if(confirm("هل أنت متأكد من تسجيل الخروج؟")) {
        localStorage.removeItem('currentUser');
        showToast("تم تسجيل الخروج بنجاح");
        setTimeout(() => window.location.href = "index.html", 1000);
    }
}

// --- 3. إدارة سلة التسوق ---

function updateCartCount() {
    const countElements = document.querySelectorAll('#cart-count');
    countElements.forEach(el => {
        el.textContent = cart.length;
    });
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({...product, quantity: 1});
    }
    saveCart();
    showToast(`تمت إضافة ${product.name} إلى السلة`);
}

// دالة إظهار تنبيه منبثق (Toast) بدلاً من الـ Alert التقليدي
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    document.body.appendChild(toast);
    
    // إزالة التنبيه بعد 3 ثوانٍ
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

// --- 4. عرض المنتجات (بيانات تجريبية احترافية) ---

function renderFeaturedProducts() {
    const container = document.getElementById('featured-products');
    if (!container) return;

    const products = [
        { id: 1, name: "ساعة ذكية Ultra", price: 1200, image: "https://images.unsplash.com/photo-1546868871-70c122467d9b?w=500" },
        { id: 2, name: "سماعات عازلة للضوضاء", price: 850, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500" },
        { id: 3, name: "كاميرا احترافية", price: 4500, image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500" },
        { id: 4, name: "نظارات شمسية عصرية", price: 320, image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500" }
    ];

    container.innerHTML = products.map(p => `
        <div class="product-card">
            <img src="${p.image}" alt="${p.name}">
            <div class="product-info">
                <h3>${p.name}</h3>
                <div class="price">${p.price} ر.س</div>
                <button class="btn-primary" onclick='addToCart(${JSON.stringify(p)})'>
                    <i class="fas fa-cart-plus"></i> إضافة للسلة
                </button>
            </div>
        </div>
    `).join('');
}

// --- 5. تهيئة الصفحة وتشغيل الدوال ---

document.addEventListener('DOMContentLoaded', () => {
    // 1. تحديث حالة الواجهة
    syncAuthStatus();
    updateCartCount();

    // 2. التحكم في قائمة الجوال (Toggle Menu)
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    if (navToggle && navMenu) {
        navToggle.onclick = () => navMenu.classList.toggle('active');
    }

    // 3. عرض المنتجات حسب الصفحة الحالية
    const path = window.location.pathname;
    if (path.includes('index.html') || path === '/' || path.endsWith('/')) {
        renderFeaturedProducts();
    }

    // 4. تعبئة بيانات الملف الشخصي (صفحة الإعدادات)
    const profileForm = document.getElementById('profile-form');
    if (profileForm && currentUser) {
        document.getElementById('edit-username').value = currentUser.email.split('@')[0];
        document.getElementById('edit-email').value = currentUser.email;
    }
});

// إرسال نموذج إنهاء الطلب (Checkout)
document.getElementById('checkout-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    showToast("تم تأكيد طلبك بنجاح! سيتم التواصل معك.");
    cart = [];
    saveCart();
    setTimeout(() => window.location.href = 'index.html', 2000);
});