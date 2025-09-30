// =================================================================
// --- ملف المصادقة (تسجيل الدخول، إنشاء حساب، تسجيل الخروج) ---
// =================================================================

// --- العنوان الجديد للخادم على الإنترنت ---
const API_URL = 'https://debt-app-backend-su0l.onrender.com';

document.addEventListener('DOMContentLoaded', ( ) => {
    // التحقق من وجود المستخدم في الصفحات المحمية
    if (document.body.id === 'main-app-page') {
        const token = localStorage.getItem('token');
        if (!token) {
            // إذا لم يكن هناك توكن، أعد المستخدم إلى صفحة تسجيل الدخول
            window.location.href = 'login.html';
        }
    }

    // إضافة وظيفة لزر تسجيل الخروج
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('token'); // حذف التوكن
            alert('تم تسجيل الخروج بنجاح.');
            window.location.href = 'login.html'; // الانتقال لصفحة الدخول
        });
    }

    // معالجة نموذج تسجيل الدخول
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const username = event.target.username.value;
            const password = event.target.password.value;

            try {
                const response = await fetch(`${API_URL}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password }),
                });

                if (response.ok) {
                    const data = await response.json();
                    localStorage.setItem('token', data.token); // حفظ التوكن
                    alert('تم تسجيل الدخول بنجاح!');
                    window.location.href = 'index.html'; // الانتقال للصفحة الرئيسية
                } else {
                    alert('اسم المستخدم أو كلمة المرور غير صحيحة.');
                }
            } catch (error) {
                console.error('Login error:', error);
                alert('حدث خطأ أثناء محاولة تسجيل الدخول.');
            }
        });
    }

    // معالجة نموذج إنشاء حساب
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const username = event.target.username.value;
            const password = event.target.password.value;

            try {
                const response = await fetch(`${API_URL}/signup`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password }),
                });

                if (response.status === 201) {
                    alert('تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.');
                    window.location.href = 'login.html';
                } else {
                    const errorData = await response.json();
                    alert(`فشل إنشاء الحساب: ${errorData.message}`);
                }
            } catch (error) {
                console.error('Signup error:', error);
                alert('حدث خطأ أثناء محاولة إنشاء الحساب.');
            }
        });
    }
});
