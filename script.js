// متغيرات عامة
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// تحديث عدد العناصر في السلة
function updateCartCount() {
    const countElement = document.getElementById('cart-count');
    if (countElement) {
        countElement.textContent = cart.length;
    }
}

// حفظ السلة في localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// إضافة منتج إلى السلة
function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({...product, quantity: 1});
    }
    
    saveCart();
    alert('تمت إضافة المنتج إلى السلة!');
}

// إزالة منتج من السلة
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    renderCartItems();
}

// تحديث كمية المنتج في السلة
function updateQuantity(productId, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        saveCart();
        renderCartItems();
    }
}

// حساب المجموع الكلي
function calculateTotal() {
    let subtotal = 0;
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
    });
    
    const shipping = 20; // رسوم الشحن
    const total = subtotal + shipping;
    
    return { subtotal, shipping, total };
}

// عرض منتجات في الصفحة الرئيسية
function renderFeaturedProducts() {
    const productsGrid = document.getElementById('featured-products');
    if (!productsGrid) return;
    
    const featuredProducts = [
        { id: 1, name: 'سماعة لاسلكية', price: 299, category: 'electronics' },
        { id: 2, name: 'قميص رياضي', price: 150, category: 'clothing' },
        { id: 3, name: 'كتاب تطوير الويب', price: 89, category: 'books' }
    ];
    
    productsGrid.innerHTML = featuredProducts.map(product => `
        <div class="product-card">
            <div class="product-image">صورة المنتج</div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">${product.price} ريال</p>
                <button class="add-to-cart" onclick="addToCart(${JSON.stringify(product).replace(/"/g, '&quot;')})">إضافة إلى السلة</button>
            </div>
        </div>
    `).join('');
}

// عرض المنتجات في صفحة المنتجات
function renderProducts() {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;
    
    const allProducts = [
        { id: 1, name: 'سماعة لاسلكية', price: 299, category: 'electronics' },
        { id: 2, name: 'قميص رياضي', price: 150, category: 'clothing' },
        { id: 3, name: 'كتاب تطوير الويب', price: 89, category: 'books' },
        { id: 4, name: 'حقيبة سفر', price: 350, category: 'home' },
        { id: 5, name: 'ساعة ذكية', price: 799, category: 'electronics' },
        { id: 6, name: 'بنطلون جينز', price: 220, category: 'clothing' }
    ];
    
    productsGrid.innerHTML = allProducts.map(product => `
        <div class="product-card">
            <div class="product-image">صورة المنتج</div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">${product.price} ريال</p>
                <button class="add-to-cart" onclick="addToCart(${JSON.stringify(product).replace(/"/g, '&quot;')})">إضافة إلى السلة</button>
            </div>
        </div>
    `).join('');
}

// عرض عناصر السلة
function renderCartItems() {
    const cartItems = document.getElementById('cart-items');
    if (!cartItems) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>السلة فارغة</p>';
        return;
    }
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">صورة المنتج</div>
            <div class="cart-item-details">
                <h3 class="cart-item-title">${item.name}</h3>
                <p class="cart-item-price">${item.price} ريال</p>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})">حذف</button>
        </div>
    `).join('');
    
    const totals = calculateTotal();
    document.getElementById('subtotal').textContent = `${totals.subtotal.toFixed(2)} ريال`;
    document.getElementById('shipping').textContent = `${totals.shipping.toFixed(2)} ريال`;
    document.getElementById('total').textContent = `${totals.total.toFixed(2)} ريال`;
}

// تسجيل الدخول
function login(username, password) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        alert('تم تسجيل الدخول بنجاح!');
        window.location.href = 'index.html';
        return true;
    } else {
        alert('اسم المستخدم أو كلمة المرور غير صحيحة');
        return false;
    }
}

// التسجيل
function register(username, email, password, phone) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // التحقق من وجود المستخدم
    if (users.find(u => u.username === username)) {
        alert('اسم المستخدم مستخدم بالفعل');
        return false;
    }
    
    if (users.find(u => u.email === email)) {
        alert('البريد الإلكتروني مستخدم بالفعل');
        return false;
    }
    
    const newUser = { id: Date.now(), username, email, password, phone };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    alert('تم التسجيل بنجاح!');
    window.location.href = 'login.html';
    return true;
}

// تحديث معلومات المستخدم
function updateProfile(username, email, phone) {
    if (currentUser) {
        currentUser.username = username;
        currentUser.email = email;
        currentUser.phone = phone;
        
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // تحديث قائمة المستخدمين
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
            users[userIndex] = currentUser;
            localStorage.setItem('users', JSON.stringify(users));
        }
        
        alert('تم تحديث المعلومات بنجاح!');
    }
}

// تغيير كلمة المرور
function changePassword(currentPassword, newPassword, confirmPassword) {
    if (!currentUser) return false;
    
    if (currentPassword !== currentUser.password) {
        alert('كلمة المرور الحالية غير صحيحة');
        return false;
    }
    
    if (newPassword !== confirmPassword) {
        alert('كلمات المرور الجديدة لا تتطابق');
        return false;
    }
    
    currentUser.password = newPassword;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // تحديث قائمة المستخدمين
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
        localStorage.setItem('users', JSON.stringify(users));
    }
    
    alert('تم تغيير كلمة المرور بنجاح!');
    return true;
}

// إرسال نموذج تسجيل الدخول
document.getElementById('loginForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    login(username, password);
});

// إرسال نموذج التسجيل
document.getElementById('registerForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('reg-username').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const phone = document.getElementById('reg-phone').value;
    register(username, email, password, phone);
});

// إرسال نموذج تحديث الملف الشخصي
document.getElementById('profile-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('edit-username').value;
    const email = document.getElementById('edit-email').value;
    const phone = document.getElementById('edit-phone').value;
    updateProfile(username, email, phone);
});

// إرسال نموذج تغيير كلمة المرور
document.getElementById('password-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    changePassword(currentPassword, newPassword, confirmPassword);
});

// إرسال نموذج إنهاء الطلب
document.getElementById('checkout-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    alert('تم إنهاء الطلب بنجاح! سيتم التواصل معك قريباً.');
    cart = [];
    saveCart();
    window.location.href = 'index.html';
});

// تهيئة الصفحة عند التحميل
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    
    if (window.location.pathname.includes('index.html')) {
        renderFeaturedProducts();
    }
    
    if (window.location.pathname.includes('products.html')) {
        renderProducts();
    }
    
    if (window.location.pathname.includes('cart.html')) {
        renderCartItems();
    }
    
    // إعداد معلومات المستخدم في الصفحة
    const profileForm = document.getElementById('profile-form');
    if (profileForm && currentUser) {
        document.getElementById('edit-username').value = currentUser.username;
        document.getElementById('edit-email').value = currentUser.email;
        document.getElementById('edit-phone').value = currentUser.phone;
    }
});

// إضافة دالة للبحث والتصفية
function filterProducts() {
    const searchTerm = document.getElementById('search-input')?.value.toLowerCase();
    const categoryFilter = document.getElementById('category-filter')?.value;
    
    // هنا يمكن إضافة منطق التصفية
    console.log('بحث عن:', searchTerm, 'تصنيف:', categoryFilter);
}
