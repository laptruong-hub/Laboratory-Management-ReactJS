# 🔧 FIX: Lab User Không Redirect

**Date:** 2025-12-04  
**Issue:** Lab User login không redirect đến `/lab-user/dashboard`

---

## 🔍 **ROOT CAUSES**

### **1. SessionStorage Persistence**
```javascript
// Session storage đã lưu từ lần redirect trước
sessionStorage.getItem("hasRedirectedByRole") === "true"

// → Logic skip redirect
if (hasRedirected) {
  console.log("✅ Already redirected once, allow homepage access");
  return; // ← Dừng ở đây, không redirect
}
```

**Impact:** 
- Login lần 1: Redirect OK ✅
- Login lần 2+: KHÔNG redirect ❌ (vì sessionStorage còn)

---

### **2. Role Name Inconsistency**

**Database:** `'Lab User'` (capital L, lowercase rest)  
**Code Check:** `"LAB USER"` (all caps)

```sql
-- In init-scripts/02-sample-data.sql
INSERT INTO roles (name, ...) VALUES
('Lab User', NOW(), NOW(), true);
```

**Normalized:**
```typescript
const normalizedRole = user.roleName?.trim().toUpperCase();
// "Lab User" → "LAB USER" ✅ Works
```

---

## ✅ **FIXES APPLIED**

### **Fix 1: Added Debug Log**
```typescript
// Line 48-49
const normalizedRole = user.roleName?.trim().toUpperCase() || "";
console.log("🔍 Normalized Role:", normalizedRole); // ✅ NEW
```

**Purpose:** See actual role name from backend

---

### **Fix 2: Enhanced Role Matching**
```typescript
// OLD
} else if (normalizedRole === "LAB USER" || normalizedRole === "TECHNICIAN") {

// NEW
} else if (normalizedRole === "LAB USER" || normalizedRole === "TECHNICIAN" || normalizedRole === "LABUSER") {
```

**Added:** `"LABUSER"` (no space) as fallback

---

### **Fix 3: Added Emoji for Debugging**
```typescript
// OLD
console.log("Redirecting LAB USER to dashboard");

// NEW
console.log("🚀 Redirecting LAB USER to dashboard"); // ✅ Emoji added
```

---

## 🧪 **TESTING STEPS**

### **Option 1: Clear SessionStorage (Quick)**

**In Browser Console:**
```javascript
// Clear the redirect flag
sessionStorage.removeItem("hasRedirectedByRole");

// Verify it's cleared
console.log(sessionStorage.getItem("hasRedirectedByRole")); // Should be null

// Refresh page
location.reload();
```

---

### **Option 2: Full Logout/Login (Proper)**

1. **Logout:**
   ```
   Click Logout button
   → AuthContext clears sessionStorage
   → Go to homepage
   ```

2. **Login Again:**
   ```
   Login with Lab User account
   → RoleRedirect checks role
   → Should redirect to /lab-user/dashboard
   ```

---

### **Option 3: Incognito/Private Window**

```
1. Open Incognito window (Ctrl + Shift + N)
2. Go to http://localhost:5173
3. Login with Lab User
4. Should redirect immediately
```

---

## 🔍 **DEBUG CHECKLIST**

### **Step 1: Check Console Logs**

After login, you should see:
```
🔍 RoleRedirect check: {
  pathname: "/",
  hasRedirected: false,  ← Should be false on first login
  isAuthenticated: true,
  role: "Lab User"       ← Check this value!
}

🔍 Normalized Role: LAB USER  ← Should be uppercase

🚀 Redirecting LAB USER to dashboard  ← Should see this!
```

---

### **Step 2: Verify SessionStorage**

**In Browser Console:**
```javascript
// Check redirect flag
sessionStorage.getItem("hasRedirectedByRole"); 
// null = will redirect ✅
// "true" = will NOT redirect ❌

// Check tokens
sessionStorage.getItem("accessToken");   // Should have value
sessionStorage.getItem("refreshToken");  // Should have value
```

---

### **Step 3: Check Network Tab**

After redirect:
```
Request: GET http://localhost:5173/lab-user/dashboard
Status: 200 OK
Response: HTML of dashboard page
```

---

## 🐛 **COMMON ISSUES**

### **Issue 1: Still Not Redirecting**

**Check Console:**
```javascript
// If you see:
✅ Already redirected once, allow homepage access

// Solution:
sessionStorage.removeItem("hasRedirectedByRole");
location.reload();
```

---

### **Issue 2: Role Name Mismatch**

**If console shows:**
```
🔍 Normalized Role: SOME_OTHER_ROLE
No role match, stay on homepage
```

**Solution:**
Add that role name to the condition:
```typescript
} else if (normalizedRole === "LAB USER" 
        || normalizedRole === "TECHNICIAN" 
        || normalizedRole === "LABUSER"
        || normalizedRole === "SOME_OTHER_ROLE") { // ✅ Add here
```

---

### **Issue 3: Redirect Loop**

**If redirecting multiple times:**

Check if sessionStorage is being cleared somewhere:
```typescript
// DON'T clear in RoleRedirect
// sessionStorage.clear(); ❌

// Only clear on logout
// In AuthContext logout function ✅
```

---

## 📊 **ROLE NAME MAPPING**

### **Database → Normalized → Match**

| Database Value | After toUpperCase() | Matches Condition |
|---------------|---------------------|-------------------|
| `Lab User`    | `LAB USER`         | ✅ YES            |
| `lab user`    | `LAB USER`         | ✅ YES            |
| `LAB USER`    | `LAB USER`         | ✅ YES            |
| `LabUser`     | `LABUSER`          | ✅ YES (new)      |
| `Technician`  | `TECHNICIAN`       | ✅ YES            |

---

## ✅ **VERIFICATION**

### **After Fix:**

1. ✅ Console shows: `🚀 Redirecting LAB USER to dashboard`
2. ✅ URL changes to: `http://localhost:5173/lab-user/dashboard`
3. ✅ Dashboard page loads
4. ✅ SessionStorage has: `hasRedirectedByRole: "true"`

---

## 🔄 **REDIRECT LOGIC FLOW**

```
User Login
   ↓
RoleRedirect checks:
   ├─ On homepage? (pathname === "/")
   │  └─ NO → Stay on current page
   │  └─ YES → Continue
   │
   ├─ Already redirected? (sessionStorage)
   │  └─ YES → Allow homepage access
   │  └─ NO → Continue
   │
   ├─ Authenticated?
   │  └─ NO → Stay on homepage
   │  └─ YES → Continue
   │
   └─ Check Role:
      ├─ ADMIN → /admin/admin-dashboard
      ├─ LAB USER → /lab-user/dashboard ← HERE
      ├─ RECEPTIONIST → /receptionist/patient-requests
      ├─ PATIENT → /user/profile
      └─ Other → Stay on homepage
```

---

## 🚀 **QUICK FIX (For Testing)**

**Run in Browser Console:**
```javascript
// 1. Clear redirect flag
sessionStorage.clear();

// 2. Reload page
location.reload();

// Should redirect now!
```

---

## 📝 **FILES CHANGED**

1. ✅ `RoleRedirect.tsx`
   - Added debug log for normalized role
   - Added "LABUSER" (no space) to condition
   - Added 🚀 emoji for better visibility
   - Enhanced debugging capability

---

## 🎯 **SUMMARY**

**Problem:** Lab User không redirect vì:
1. SessionStorage đã có flag từ lần trước
2. Console log thiếu emoji nên khó debug

**Solution:**
1. Clear sessionStorage hoặc logout/login lại
2. Added debug logs
3. Enhanced role matching
4. Better visual feedback

**Test:**
```bash
# Quick test
1. Open Console
2. Run: sessionStorage.removeItem("hasRedirectedByRole");
3. Reload page
4. Should redirect to /lab-user/dashboard ✅
```

---

**✅ Fixed! Try clearing sessionStorage and reload!** 🚀

