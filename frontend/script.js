// <<<<<<< تم إضافة هذا السطر ليضمن تحميل الصفحة أولاً >>>>>>>
document.addEventListener('DOMContentLoaded', () => {

    // التحقق من وجود المستخدم في الصفحة الرئيسية
    if (document.getElementById('debt-form')) {
        // إذا لم تكن هناك هوية، لا تفعل شيئًا (ربما يجب إعادة توجيهه)
        const userId = localStorage.getItem('userId');
        if (!userId) {
            console.error('لم يتم العثور على هوية المستخدم. يرجى تسجيل الدخول.');
            // يمكنك هنا إعادة توجيه المستخدم لصفحة الدخول
            window.location.href = 'login.html';
            return; // أوقف التنفيذ
        }
        
        // جلب الديون الحالية عند تحميل الصفحة
        fetchDebts();

        // إضافة مستمع حدث لنموذج إضافة الدين
        document.getElementById('debt-form').addEventListener('submit', addDebt);
    }

});


// --- دالة جلب الديون الخاصة بالمستخدم الحالي ---
async function fetchDebts() {
    const userId = localStorage.getItem('userId');
    const debtList = document.getElementById('debt-list');
    debtList.innerHTML = ''; // تفريغ القائمة القديمة

    try {
        const response = await fetch(`http://localhost:3000/api/debts/${userId}` );
        if (!response.ok) {
            throw new Error('فشل في جلب الأسباب');
        }
        const debts = await response.json();
        debts.forEach(debt => {
            const li = document.createElement('li');
            li.innerHTML = `
                ${debt.personName}: ${debt.amount} ريال - تاريخ الاستحقاق: ${new Date(debt.dueDate).toLocaleDateString()}
                  

                الحالة: ${debt.isPaid ? 'مدفوع' : 'غير مدفوع'}
                <button onclick="deleteDebt('${debt._id}')">حذف</button>
            `;
            debtList.appendChild(li);
        });
    } catch (error) {
        console.error('خطأ في جلب الديون:', error);
    }
}

// --- دالة إضافة دين جديد ---
async function addDebt(event) {
    event.preventDefault();
    const userId = localStorage.getItem('userId');

    const debt = {
        personName: document.getElementById('personName').value,
        amount: document.getElementById('amount').value,
        type: document.getElementById('type').value,
        dueDate: document.getElementById('dueDate').value,
        notes: document.getElementById('notes').value,
        isPaid: document.getElementById('isPaid').checked,
        userId: userId // إضافة هوية المستخدم إلى بيانات الدين
    };

    try {
        const response = await fetch('http://localhost:3000/api/debts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(debt )
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'فشل في إضافة الدين');
        }

        document.getElementById('debt-form').reset();
        fetchDebts(); // أعد تحميل قائمة الديون
    } catch (error) {
        console.error('خطأ في إضافة الدين:', error);
        alert(`تنبيه: ${error.message}`);
    }
}

// --- دالة حذف الدين ---
async function deleteDebt(id) {
    try {
        const response = await fetch(`http://localhost:3000/api/debts/${id}`, {
            method: 'DELETE'
        } );

        if (!response.ok) {
            throw new Error('فشل في حذف الدين');
        }
        fetchDebts(); // أعد تحميل قائمة الديون
    } catch (error) {
        console.error('خطأ في حذف الدين:', error);
        alert(`تنبيه: ${error.message}`);
    }
}
