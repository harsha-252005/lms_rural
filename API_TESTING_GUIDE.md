# LMS API Testing Guide - Refactored Integration

## Database Setup
- Database: lms_db
- Username: root
- Password: root
- Port: 3306

## Testing Flow

### 1. Register Instructor
```bash
POST http://localhost:8080/api/instructors/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "specialization": "Mathematics",
  "password": "password123"
}
```
**Expected**: Returns instructor object with ID (e.g., instructorId = 1)

---

### 2. Register Student
```bash
POST http://localhost:8080/api/students
Content-Type: application/json

{
  "name": "Jane Student",
  "email": "jane@example.com",
  "phone": "9876543210",
  "village": "Rural Village",
  "classLevel": "10",
  "password": "student123"
}
```
**Expected**: Returns student object with ID (e.g., studentId = 1)

---

### 3. Create Course (with instructorId)
```bash
POST http://localhost:8080/api/courses/create-with-videos
Content-Type: multipart/form-data

courseTitle: Introduction to Algebra
description: Learn basic algebra concepts
classLevel: 10
category: Mathematics
status: Published
instructorId: 1
thumbnail: [file]
videos: [file1, file2]
```
**Expected**: 
- Course created successfully with ID
- Course is linked to instructor
- If status=Published, students in classLevel=10 are auto-enrolled

---

### 4. Get Instructor's Courses (Manage Course Page)
```bash
GET http://localhost:8080/api/instructors/{instructorId}/courses
```
**Example**: `GET http://localhost:8080/api/instructors/1/courses`

**Expected**: 
- Returns list of all courses created by this instructor
- Each course includes instructor details
- This API should be used in "Manage Course" page

**Alternative API**:
```bash
GET http://localhost:8080/api/courses/instructor/{instructorId}
```

---

### 5. Get Student's Enrolled Courses (Student Dashboard)
```bash
GET http://localhost:8080/api/students/{studentId}/courses
```
**Example**: `GET http://localhost:8080/api/students/1/courses`

**Expected**: 
- Returns list of courses the student is enrolled in
- Only shows enrolled courses, not all courses
- This API should be used in "Student Dashboard - My Courses"

---

### 6. Get Student's Enrollments (with progress)
```bash
GET http://localhost:8080/api/enrollments/student/{studentId}
```
**Example**: `GET http://localhost:8080/api/enrollments/student/1`

**Expected**: 
- Returns enrollment objects with course details, progress, and status
- Use this if you need enrollment-specific data (progress, status)

---

### 7. Manual Enrollment (if needed)
```bash
POST http://localhost:8080/api/enrollments/enroll
Content-Type: application/json

{
  "studentId": 1,
  "courseId": 1
}
```
**Expected**: Creates enrollment record

---

## Key Points

### For Instructor Dashboard - Manage Course Page:
✅ **USE**: `GET /api/instructors/{instructorId}/courses`
❌ **DON'T USE**: `GET /api/courses` (returns all courses, not filtered)

### For Student Dashboard - My Courses:
✅ **USE**: `GET /api/students/{studentId}/courses`
❌ **DON'T USE**: `GET /api/courses` (returns all courses, not enrolled ones)

### Course Creation:
✅ **MUST** include `instructorId` in request
✅ Course is automatically linked to instructor
✅ If status="Published", students are auto-enrolled based on classLevel

---

## Logging

Check console logs for debugging:
- `DEBUG_COURSE:` - Course creation and fetching
- `DEBUG_INSTRUCTOR:` - Instructor operations
- `DEBUG_INSTRUCTOR_SERVICE:` - Service layer operations
- `DEBUG_STUDENT:` - Student course fetching
- `DEBUG_ENROLLMENT:` - Enrollment operations
- `DEBUG_ENROLL:` - Auto-enrollment process

---

## Common Issues Fixed

1. ✅ Course not visible in Manage Course page
   - **Solution**: Use `/api/instructors/{instructorId}/courses` instead of `/api/courses`

2. ✅ Student dashboard not showing enrolled courses
   - **Solution**: Use `/api/students/{studentId}/courses` instead of `/api/courses`

3. ✅ Course created without instructor
   - **Solution**: instructorId is now required, validation added

4. ✅ JSON serialization errors (infinite recursion)
   - **Solution**: Proper @JsonIgnore and @JsonIgnoreProperties on entities

5. ✅ Lazy loading issues
   - **Solution**: Service methods properly fetch data using repositories
