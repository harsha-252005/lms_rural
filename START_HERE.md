# 🚀 START HERE - Quick Start Guide

## Step 1: Start Backend (Required)

Open terminal in project directory and run:

```bash
cd "c:\Users\nirru\OneDrive\Desktop\lms for rural\lms-for-rural"
mvn spring-boot:run
```

Wait for: `Started LmsForRuralApplication in X seconds`

## Step 2: Test APIs (Verify Backend)

Open another terminal and run:

```bash
cd "c:\Users\nirru\OneDrive\Desktop\lms for rural\lms-for-rural"
powershell -ExecutionPolicy Bypass -File test-apis.ps1
```

This will:
- ✓ Check backend is running
- ✓ Register test instructor
- ✓ Register test student  
- ✓ Test all API endpoints
- ✓ Show instructor ID and student ID

## Step 3: Update Frontend

### File: Instructor Dashboard (Manage Course Page)

**Find and replace:**
```javascript
// OLD ❌
fetch('/api/courses')

// NEW ✅
const instructorId = localStorage.getItem('userId'); // or from your auth context
fetch(`/api/instructors/${instructorId}/courses`)
```

### File: Student Dashboard (My Courses)

**Find and replace:**
```javascript
// OLD ❌
fetch('/api/courses')

// NEW ✅
const studentId = localStorage.getItem('userId'); // or from your auth context
fetch(`/api/students/${studentId}/courses`)
```

### File: Course Creation Form

**Ensure instructorId is included:**
```javascript
const instructorId = localStorage.getItem('userId');
formData.append('instructorId', instructorId); // ✅ REQUIRED
```

## Step 4: Test Complete Flow

1. **Register Instructor** (or use test instructor from Step 2)
2. **Login as Instructor**
3. **Create Course** with:
   - Title, description, classLevel, category
   - instructorId (from login)
   - status: "Published"
4. **Verify** course appears in Manage Course page
5. **Login as Student** (with matching classLevel)
6. **Verify** course appears in Student Dashboard

## 🔍 Debugging

### Check Backend Logs
Look for these DEBUG messages:
```
DEBUG_COURSE: Creating course for instructor ID: X
DEBUG_COURSE: Course saved successfully with ID: Y
DEBUG_INSTRUCTOR: Fetching courses for instructorId=X
DEBUG_STUDENT: Fetching courses for studentId=X
DEBUG_ENROLL: Starting auto-enrollment...
```

### Check Database
```sql
-- Connect to MySQL
mysql -u root -p
-- Password: root

USE lms_db;

-- Check data
SELECT * FROM instructors;
SELECT * FROM students;
SELECT * FROM courses;
SELECT * FROM enrollments;

-- Verify course has instructor
SELECT c.id, c.title, c.instructor_id, i.name 
FROM courses c 
JOIN instructors i ON c.instructor_id = i.id;
```

### Test APIs Manually
```bash
# Get instructor courses
curl http://localhost:8080/api/instructors/1/courses

# Get student courses
curl http://localhost:8080/api/students/1/courses

# Get all courses
curl http://localhost:8080/api/courses
```

## ✅ Success Checklist

- [ ] Backend starts without errors
- [ ] test-apis.ps1 runs successfully
- [ ] Instructor can create course
- [ ] Course appears in Manage Course page
- [ ] Student sees enrolled courses
- [ ] No console errors
- [ ] DEBUG logs appear

## 📚 Need Help?

- **API Testing**: See `API_TESTING_GUIDE.md`
- **Frontend Integration**: See `FRONTEND_API_REFERENCE.md`
- **Issues**: See `TROUBLESHOOTING_GUIDE.md`
- **Overview**: See `README_REFACTORING.md`

## 🎯 Key Endpoints

| Purpose | Endpoint | Use In |
|---------|----------|--------|
| Instructor's courses | GET /api/instructors/{id}/courses | Manage Course page |
| Student's courses | GET /api/students/{id}/courses | Student Dashboard |
| Create course | POST /api/courses/create-with-videos | Course creation form |
| All courses | GET /api/courses | Browse/Search page only |

---

**Everything is ready! Start the backend and test the APIs.** 🚀
