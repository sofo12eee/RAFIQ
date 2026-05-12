# دليل نشر "رفيق" على Railway + Cloudflare — خطوة بخطوة

---

## المتطلبات الأولية

1. **حساب GitHub** → https://github.com (مجاني)
2. **حساب Cloudflare** → https://cloudflare.com (مجاني)
3. **حساب Railway** → https://railway.app (5$/شهر بعد الفترة المجانية)
4. **Git مثبت** على جهازك (موجود عندك أصلاً)

---

## الخطوة 1: رفع المشروع على GitHub

افتح Terminal في مجلد المشروع:

```
cd C:\Users\HP\Projects\medsaas-algeria\rafiq
```

ثم نفّذ هذه الأوامر:

```
git init
git add .
git commit -m "Initial commit - Rafiq app"
```

اذهب لـ GitHub وأنشئ Repository جديد:
- اسمه: `rafiq`
- اتركه Public (أو Private إذا تحب)
- لا تضف README ولا .gitignore

بعدها نفّذ:

```
git remote add origin https://github.com/USERNAME/rafiq.git
git branch -M main
git push -u origin main
```

(بدّل USERNAME باسم حسابك)

---

## الخطوة 2: نشر الـ Backend على Railway

### 2.1 — ادخل Railway
- اذهب لـ https://railway.app
- سجّل بحساب GitHub

### 2.2 — أنشئ مشروع جديد
- اضغط "New Project"
- اختار "Deploy from GitHub Repo"
- اختار repository `rafiq`

### 2.3 — إعدادات Railway (مهم جداً)
في لوحة التحكم تاع المشروع:

**Settings → Build:**
```
Root Directory: server
Build Command: npm install
Start Command: node index.js
```

**Variables (متغيرات البيئة):**
```
PORT = 3001
```

### 2.4 — أضف دومين
- Settings → Networking → Generate Domain
- Railway يعطيك رابط مثل: `rafiq-production.up.railway.app`
- هذا هو رابط الـ API تاعك

### 2.5 — تأكد أنه يعمل
- افتح: `https://rafiq-production.up.railway.app/api/testimonies`
- لازم يظهرلك JSON بالشهادات

---

## الخطوة 3: نشر الـ Frontend على Cloudflare Pages

### 3.1 — ادخل Cloudflare
- اذهب لـ https://dash.cloudflare.com
- سجّل حساب مجاني

### 3.2 — أنشئ مشروع Pages
- في القائمة اليسرى: **Workers & Pages**
- اضغط **Create**
- اختار **Pages** → **Connect to Git**
- اربط حساب GitHub واختار repository `rafiq`

### 3.3 — إعدادات البناء (Build Settings)
```
Framework preset: None
Build command: npm install && npx vite build
Build output directory: dist
Root directory: (اتركه فارغ)
```

### 3.4 — أضف متغير البيئة
في **Environment Variables** أضف:
```
VITE_API_URL = https://rafiq-production.up.railway.app
```

### 3.5 — اضغط Deploy
- Cloudflare يبني المشروع وينشره
- يعطيك رابط مثل: `rafiq.pages.dev`

---

## الخطوة 4: ربط الدومين الخاص

### 4.1 — اشترِ دومين
- من Namecheap أو Hostinger (مثلاً: `rafiq-dz.com`)
- التكلفة: ~3000 دج/سنة

### 4.2 — أضف الدومين في Cloudflare
- Cloudflare Pages → Custom domains → Add
- اكتب: `rafiq-dz.com`
- Cloudflare يعطيك DNS records

### 4.3 — غيّر NS في Namecheap/Hostinger
- في لوحة تحكم الدومين
- غيّر Nameservers إلى اللي أعطاك Cloudflare:
```
ns1.cloudflare.com
ns2.cloudflare.com
```

### 4.4 — انتظر 24 ساعة
- بعدها الموقع يشتغل على: `https://rafiq-dz.com`

---

## الخطوة 5: تعديل الفرونت لاستخدام API الحقيقي

في ملف `src/pages/SawtElMrid.tsx` غيّر:
```
const API = '/api'
```
إلى:
```
const API = 'https://rafiq-production.up.railway.app/api'
```

نفس الشيء في `src/pages/MshWahdek.tsx`.

أو الطريقة الأحسن — استخدم Cloudflare Pages Functions كـ proxy:

أنشئ ملف `public/_routes.json`:
```json
{
  "version": 1,
  "include": ["/*"],
  "exclude": ["/api/*"]
}
```

وأنشئ ملف `functions/api/[[path]].js`:
```javascript
export async function onRequest(context) {
  const url = new URL(context.request.url);
  const apiUrl = 'https://rafiq-production.up.railway.app' + url.pathname;
  return fetch(apiUrl, {
    method: context.request.method,
    headers: context.request.headers,
    body: context.request.body,
  });
}
```

بهذه الطريقة، `/api` يبقى يشتغل بدون تغيير الكود!

---

## الخطوة 6: تحديثات مستقبلية

كل مرة تعدّل الكود:
```
git add .
git commit -m "وصف التعديل"
git push
```

- Cloudflare يعيد بناء الفرونت تلقائياً (30 ثانية)
- Railway يعيد تشغيل الباك تلقائياً (1 دقيقة)

---

## ملخص الهيكل النهائي

```
المستخدم ← rafiq-dz.com (Cloudflare CDN - سريع جداً)
                ↓
         الفرونت (HTML/CSS/JS) ← Cloudflare Pages (مجاني)
                ↓
         /api/* ← Railway (Node.js + SQLite) (5$/شهر)
```

## التكلفة الشهرية النهائية:
- Cloudflare Pages: 0$
- Railway: 5$ (~1800 دج)
- دومين: ~250 دج/شهر
- **المجموع: ~2000 دج/شهر فقط لمئات الآلاف من المستخدمين**

---

## نصائح مهمة:
1. **إذا كبر المشروع فوق 500K مستخدم** ← رقّي SQLite إلى PostgreSQL على Railway (سهل)
2. **Backup يومي** ← Railway يدير backup تلقائي
3. **SSL مجاني** ← Cloudflare يوفره تلقائياً
4. **حماية DDoS** ← Cloudflare يحميك مجاناً

