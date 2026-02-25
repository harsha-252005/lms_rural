# Frontend API Quick Reference

## 🔴 CRITICAL: Use These Endpoints

### Instructor Dashboard - Manage Course Page
```javascript
// ✅ CORRECT - Shows only instructor's courses
GET /api/instructors/{instructorId}/courses

// ❌ WRONG - Shows ALL courses
GET /api/courses
```

### Student Dashboard - My Courses
```javascript
// ✅ CORRECT - Shows only enrolled courses
GET /api/students/{studentId}/courses

// ❌ WRONG - Shows ALL courses
GET /api/courses
```

---

## API Endpoints by Feature

### 1. Create Course (Instructor)
```javascript
POST /api/courses/create-with-videos
Content-Type: multipart/form-data

Required Fields:
- courseTitle
- description
- classLevel
- category
- instructorId  // ⚠️ MUST include this!

Optional Fields:
- status (default: "Draft")
- thumbnail (file)
- videos (array of files)
```

**After Success**: Navigate to Manage Course page

---

### 2. View My Courses (Instructor)
```javascript
GET /api/instructors/{instructorId}/courses

Response: Array of Course objects
[
  {
    "id": 1,
    "title": "Course Title",
    "description": "...",
    "classLevel": "10",
    "category": "Math",
    "status": "Published",
    "thumbnailPath": "/uploads/1/thumbnail/image.jpg",
    "instructor": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    },
    "createdAt": "2024-01-01T10:00:00",
    "updatedAt": "2024-01-01T10:00:00"
  }
]
```

---

### 3. View Enrolled Courses (Student)
```javascript
GET /api/students/{studentId}/courses

Response: Array of Course objects (only enrolled courses)
[
  {
    "id": 1,
    "title": "Course Title",
    "description": "...",
    "classLevel": "10",
    "category": "Math",
    "status": "Published",
    "thumbnailPath": "/uploads/1/thumbnail/image.jpg",
    "instructor": {
      "id": 1,
      "name": "John Doe"
    }
  }
]
```

---

### 4. View Enrollments with Progress (Student)
```javascript
GET /api/enrollments/student/{studentId}

Response: Array of Enrollment objects
[
  {
    "id": 1,
    "student": {
      "id": 1,
      "name": "Jane Student",
      "email": "jane@example.com"
    },
    "course": {
      "id": 1,
      "title": "Course Title",
      "description": "...",
      "thumbnailPath": "/uploads/1/thumbnail/image.jpg"
    },
    "enrollmentDate": "2024-01-01T10:00:00",
    "progressPercentage": 45.5,
    "status": "ENROLLED"
  }
]
```

---

### 5. Update Course (Instructor)
```javascript
PUT /api/courses/{courseId}/update
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "Updated description",
  "classLevel": "10",
  "category": "Math",
  "status": "Published"
}
```

---

### 6. Delete Course (Instructor)
```javascript
DELETE /api/courses/{courseId}/delete
```

---

### 7. Manual Enrollment (if needed)
```javascript
POST /api/enrollments/enroll
Content-Type: application/json

{
  "studentId": 1,
  "courseId": 1
}
```

---

## React/Vue Example Code

### Instructor - Fetch My Courses
```javascript
const fetchMyCourses = async (instructorId) => {
  try {
    const response = await fetch(`http://localhost:8080/api/instructors/${instructorId}/courses`);
    if (!response.ok) throw new Error('Failed to fetch courses');
    const courses = await response.json();
    console.log('My courses:', courses);
    return courses;
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### Student - Fetch Enrolled Courses
```javascript
const fetchEnrolledCourses = async (studentId) => {
  try {
    const response = await fetch(`http://localhost:8080/api/students/${studentId}/courses`);
    if (!response.ok) throw new Error('Failed to fetch courses');
    const courses = await response.json();
    console.log('Enrolled courses:', courses);
    return courses;
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### Create Course with Files
```javascript
const createCourse = async (courseData, instructorId) => {
  const formData = new FormData();
  formData.append('courseTitle', courseData.title);
  formData.append('description', courseData.description);
  formData.append('classLevel', courseData.classLevel);
  formData.append('category', courseData.category);
  formData.append('status', courseData.status || 'Draft');
  formData.append('instructorId', instructorId);  // ⚠️ REQUIRED
  
  if (courseData.thumbnail) {
    formData.append('thumbnail', courseData.thumbnail);
  }
  
  if (courseData.videos && courseData.videos.length > 0) {
    courseData.videos.forEach(video => {
      formData.append('videos', video);
    });
  }
  
  try {
    const response = await fetch('http://localhost:8080/api/courses/create-with-videos', {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) throw new Error('Failed to create course');
    const course = await response.json();
    console.log('Course created:', course);
    
    // Navigate to Manage Course page
    window.location.href = '/instructor/manage-courses';
    
    return course;
  } catch (error) {
    console.error('Error:', error);
  }
};
```

---

## Common Mistakes to Avoid

### ❌ DON'T DO THIS:
```javascript
// Wrong: Fetching all courses for instructor dashboard
fetch('/api/courses')  // Returns ALL courses, not just instructor's

// Wrong: Fetching all courses for student dashboard
fetch('/api/courses')  // Returns ALL courses, not just enrolled ones

// Wrong: Creating course without instructorId
formData.append('instructorId', null)  // Will fail validation
```

### ✅ DO THIS:
```javascript
// Correct: Fetch instructor's courses
fetch(`/api/instructors/${instructorId}/courses`)

// Correct: Fetch student's enrolled courses
fetch(`/api/students/${studentId}/courses`)

// Correct: Always include instructorId
formData.append('instructorId', instructorId)
```

---

## Auto-Enrollment Feature

When a course is created or updated with `status: "Published"`:
- All students with matching `classLevel` are automatically enrolled
- No manual enrollment needed
- Students will see the course in their dashboard immediately

Example:
```javascript
// Create course for Class 10
{
  "classLevel": "10",
  "status": "Published"
}
// → All students with classLevel="10" are auto-enrolled
```

---

## Error Handling

```javascript
const handleApiCall = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API call failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    // Show error to user
    alert(error.message);
    throw error;
  }
};
```

---

## Local Storage Helper (for storing user info)

```javascript
// After login, store user info
const saveUserInfo = (userType, userId, userData) => {
  localStorage.setItem('userType', userType);  // 'instructor' or 'student'
  localStorage.setItem('userId', userId);
  localStorage.setItem('userData', JSON.stringify(userData));
};

// Get current user
const getCurrentUser = () => {
  return {
    type: localStorage.getItem('userType'),
    id: localStorage.getItem('userId'),
    data: JSON.parse(localStorage.getItem('userData'))
  };
};

// Use in components
const user = getCurrentUser();
if (user.type === 'instructor') {
  fetchMyCourses(user.id);
} else if (user.type === 'student') {
  fetchEnrolledCourses(user.id);
}
```

---

## Testing URLs

Base URL: `http://localhost:8080`

Test in browser or Postman:
- Instructor courses: `http://localhost:8080/api/instructors/1/courses`
- Student courses: `http://localhost:8080/api/students/1/courses`
- All courses: `http://localhost:8080/api/courses` (for browse/search page only)
