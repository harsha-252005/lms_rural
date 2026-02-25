# 🔧 Quick Fix - Manage Courses Empty Issue

## Problem
Manage Courses page is empty after creating a course.

## Root Cause
User data in localStorage might not have `id` or `role` properly set.

## Solution Applied
1. Fixed login to ensure `role` is always stored
2. Added console logging to debug
3. Updated ManageCourses to use correct endpoint

## Quick Test Steps

### Step 1: Clear and Re-login
```javascript
// Open browser console (F12) and run:
localStorage.clear();
// Then login again
```

### Step 2: Check User Data
```javascript
// After login, check in console:
const user = JSON.parse(localStorage.getItem('user'));
console.log('User:', user);
console.log('ID:', user.id);
console.log('Role:', user.role);
```

Expected output:
```
User: {id: 1, name: "...", email: "...", role: "INSTRUCTOR"}
ID: 1
Role: INSTRUCTOR
```

### Step 3: Test API Directly
```javascript
// In console:
fetch('http://localhost:8080/api/instructors/1/courses')
    .then(r => r.json())
    .then(d => console.log('Courses:', d));
```

## If Still Empty

### Check Backend
1. Backend running? `mvn spring-boot:run`
2. Check logs for: `DEBUG_INSTRUCTOR: Fetching courses for instructorId=X`

### Check Database
```sql
USE lms_db;
SELECT * FROM instructors;
SELECT * FROM courses;
SELECT * FROM courses WHERE instructor_id = 1;
```

### Manual Fix
If user data is wrong, fix it manually:
```javascript
// In browser console:
localStorage.setItem('user', JSON.stringify({
    id: 1,  // Your instructor ID from database
    name: "Your Name",
    email: "your@email.com",
    role: "INSTRUCTOR"
}));
// Refresh page
location.reload();
```

## Files Modified
1. `LoginV2.jsx` - Fixed to ensure role is stored
2. `ManageCourses.jsx` - Uses `/instructors/{id}/courses`

---

**Try: Clear localStorage → Login again → Should work!**
