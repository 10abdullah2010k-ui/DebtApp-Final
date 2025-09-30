const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5000;

// --- Middleware ---
// تفعيل CORS للسماح بالاتصالات من الواجهة الأمامية
app.use(cors());
// تفعيل body-parser لفهم البيانات القادمة بصيغة JSON
app.use(bodyParser.json());

// --- بيانات وهمية مؤقتة (بديل لقاعدة البيانات حاليًا) ---
let users = [];
let debts = [];
let nextUserId = 1;
let nextDebtId = 1;

// =================================================================
// --- Routes (نقاط النهاية) ---
// =================================================================

// 1. إنشاء حساب جديد
app.post('/signup', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    const userExists = users.find(u => u.username === username);
    if (userExists) {
        return res.status(400).json({ message: "User already exists" });
    }

    const newUser = { id: nextUserId++, username, password }; // ملاحظة: يجب تشفير كلمة المرور في تطبيق حقيقي
    users.push(newUser);
    
    console.log("A new user has signed up:", newUser);
    console.log("All users:", users);
    res.status(201).json({ message: "User created successfully" });
});

// 2. تسجيل الدخول
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        console.log("User logged in successfully:", user);
        // في تطبيق حقيقي، نستخدم JWT. الآن نرسل "توكن" وهمي كدليل على النجاح.
        res.json({ token: `fake-token-for-user-${user.id}` });
    } else {
        console.log("Failed login attempt for username:", username);
        res.status(401).json({ message: "Invalid credentials" });
    }
});

// 3. جلب كل الديون
app.get('/debts', (req, res) => {
    // ملاحظة: في تطبيق حقيقي، سنقوم بفلترة الديون بناءً على هوية المستخدم من التوكن
    console.log("Fetching all debts.");
    res.json(debts);
});

// 4. إضافة دين جديد
app.post('/debts', (req, res) => {
    const { name, amount, dueDate, notes } = req.body;

    if (!name || !amount || !dueDate) {
        return res.status(400).json({ message: "Name, amount, and due date are required" });
    }

    const newDebt = { 
        id: nextDebtId++, 
        name, 
        amount: parseFloat(amount), // تحويل المبلغ إلى رقم عشري
        dueDate, 
        notes 
    };
    
    debts.push(newDebt);
    console.log("New debt added:", newDebt);
    console.log("All debts:", debts);
    
    // إرجاع الدين الجديد الذي تم إنشاؤه للواجهة الأمامية
    res.status(201).json(newDebt);
});


// =================================================================
// --- تشغيل الخادم ---
// =================================================================
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}` );
    console.log("Waiting for requests...");
});
