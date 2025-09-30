// =================================================================
// --- الكود المدمج لوظائف الديون (عرض، إضافة، حذف، تصدير) ---
// =================================================================

// --- العنوان الجديد للخادم على الإنترنت ---
const API_URL = 'https://debt-app-backend-su0l.onrender.com';

// انتظر حتى يتم تحميل الصفحة بالكامل
document.addEventListener('DOMContentLoaded', ( ) => {
    // جلب وعرض الديون عند تحميل الصفحة
    fetchAndDisplayDebts();

    // معالجة نموذج إضافة دين جديد
    const addDebtForm = document.getElementById('add-debt-form');
    if (addDebtForm) {
        addDebtForm.addEventListener('submit', handleAddDebt);
    }

    // معالجة زر تصدير Excel
    const exportButton = document.getElementById('export-excel');
    if (exportButton) {
        exportButton.addEventListener('click', exportTableToExcel);
    }
});

// --- الدوال الرئيسية ---

/**
 * الدالة 1: تتصل بالخادم وتطلب منه كل الديون لعرضها.
 */
async function fetchAndDisplayDebts() {
    try {
        const response = await fetch(`${API_URL}/debts`);
        if (!response.ok) throw new Error('Failed to fetch debts');
        
        const debts = await response.json();
        const debtsList = document.getElementById('debts-list');
        debtsList.innerHTML = ''; // تفريغ الجدول أولاً

        debts.forEach(debt => addDebtToTable(debt));

    } catch (error) {
        console.error('Error fetching debts:', error);
    }
}

/**
 * الدالة 2: تعالج حدث إرسال نموذج إضافة الدين.
 */
async function handleAddDebt(event) {
    event.preventDefault(); // منع تحديث الصفحة

    const form = event.target;
    const name = form.querySelector('#name').value;
    const amount = form.querySelector('#amount').value;
    const dueDate = form.querySelector('#due-date').value;
    const notes = form.querySelector('#notes').value;

    try {
        const response = await fetch(`${API_URL}/debts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, amount, dueDate, notes }),
        });

        if (!response.ok) throw new Error('Failed to add debt');

        const newDebt = await response.json();
        addDebtToTable(newDebt); // إضافة الدين الجديد للجدول فورًا
        form.reset(); // تفريغ النموذج
        alert('تمت إضافة الدين بنجاح!');

    } catch (error) {
        console.error('Error adding debt:', error);
        alert('فشلت إضافة الدين. تأكد من أن الخادم يعمل.');
    }
}

/**
 * الدالة 3: دالة مساعدة لإضافة صف دين إلى الجدول في الواجهة.
 */
function addDebtToTable(debt) {
    const debtsList = document.getElementById('debts-list');
    if (!debtsList) return;

    const row = debtsList.insertRow();
    row.setAttribute('data-debt-id', debt.id);

    row.innerHTML = `
        <td>${debt.name}</td>
        <td>${debt.amount}</td>
        <td>${debt.dueDate}</td>
        <td>${debt.notes || ''}</td>
        <td>
            <button class="btn btn-danger btn-sm" onclick="handleDeleteDebt(${debt.id})">حذف</button>
        </td>
    `;
}

/**
 * الدالة 4: تعالج حدث حذف الدين.
 */
async function handleDeleteDebt(debtId) {
    if (!confirm('هل أنت متأكد من أنك تريد حذف هذا الدين؟')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/debts/${debtId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            // حذف الصف من الجدول في الواجهة
            const rowToDelete = document.querySelector(`tr[data-debt-id='${debtId}']`);
            if (rowToDelete) {
                rowToDelete.remove();
            }
            alert('تم حذف الدين بنجاح.');
        } else {
            alert('فشل حذف الدين.');
        }
    } catch (error) {
        console.error('Error deleting debt:', error);
        alert('حدث خطأ أثناء محاولة الحذف.');
    }
}

/**
 * الدالة 5: تصدير الجدول إلى ملف Excel.
 */
function exportTableToExcel() {
    const table = document.querySelector("table");
    const wb = XLSX.utils.table_to_book(table, { sheet: "Debts" });
    XLSX.writeFile(wb, "Debts_Report.xlsx");
}
