# LMS Data Flow Diagram

## Entity Relationship Diagram

```
┌─────────────────┐
│   INSTRUCTOR    │
├─────────────────┤
│ id (PK)         │
│ name            │
│ email           │
│ phone           │
│ specialization  │
│ password        │
└────────┬────────┘
         │
         │ 1:N (OneToMany)
         │ mappedBy="instructor"
         │
         ▼
┌─────────────────┐
│     COURSE      │
├─────────────────┤
│ id (PK)         │
│ title           │
│ description     │
│ classLevel      │
│ category        │
│ status          │
│ thumbnailPath   │
│ instructor_id   │◄─── ManyToOne (nullable=false)
└────────┬────────┘
         │
         │ 1:N
         │
         ▼
┌─────────────────┐
│   ENROLLMENT    │
├─────────────────┤
│ id (PK)         │
│ student_id (FK) │
│ course_id (FK)  │
│ enrollmentDate  │
│ progress        │
│ status          │
└────────┬────────┘
         │
         │ N:1
         │
         ▼
┌─────────────────┐
│    STUDENT      │
├─────────────────┤
│ id (PK)         │
│ name            │
│ email           │
│ phone           │
│ village         │
│ classLevel      │
│ password        │
└─────────────────┘
```

---

## Course Creation Flow

```
┌──────────────┐
│   Frontend   │
│  (Instructor)│
└──────┬───────┘
       │
       │ POST /api/courses/create-with-videos
       │ {
       │   courseTitle: "...",
       │   instructorId: 1,  ◄─── REQUIRED
       │   classLevel: "10",
       │   status: "Published"
       │ }
       │
       ▼
┌──────────────────────┐
│  CourseController    │
│  createCourseWith    │
│  Videos()            │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  CourseService       │
│  createCourseWith    │
│  Videos()            │
└──────┬───────────────┘
       │
       │ 1. Validate instructorId
       ▼
┌──────────────────────┐
│ InstructorRepository │
│ findById(id)         │
└──────┬───────────────┘
       │
       │ 2. If not found → throw exception
       │ 3. If found → continue
       │
       ▼
┌──────────────────────┐
│  Create Course       │
│  course.setInstructor│
│  (instructor)        │
└──────┬───────────────┘
       │
       │ 4. Save course
       ▼
┌──────────────────────┐
│  CourseRepository    │
│  save(course)        │
└──────┬───────────────┘
       │
       │ 5. If status="Published"
       ▼
┌──────────────────────┐
│  Auto-Enrollment     │
│  - Find students     │
│    with matching     │
│    classLevel        │
│  - Create enrollment │
│    records           │
└──────┬───────────────┘
       │
       │ 6. Return course
       ▼
┌──────────────────────┐
│  Frontend            │
│  Navigate to         │
│  Manage Course page  │
└──────────────────────┘
```

---

## Instructor Dashboard - Manage Course Flow

```
┌──────────────┐
│   Frontend   │
│  (Instructor)│
│  Dashboard   │
└──────┬───────┘
       │
       │ GET /api/instructors/{instructorId}/courses
       │
       ▼
┌──────────────────────┐
│ InstructorController │
│ getInstructorCourses │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ InstructorService    │
│ getCoursesByInstructor│
└──────┬───────────────┘
       │
       │ 1. Validate instructor exists
       │ 2. Fetch courses
       ▼
┌──────────────────────┐
│  CourseRepository    │
│  findByInstructorId  │
│  (instructorId)      │
└──────┬───────────────┘
       │
       │ Returns: List<Course>
       │ - Only courses created by this instructor
       │ - Includes instructor details
       │
       ▼
┌──────────────────────┐
│  Frontend            │
│  Display courses     │
│  in Manage Course    │
│  page                │
└──────────────────────┘
```

---

## Student Dashboard - My Courses Flow

```
┌──────────────┐
│   Frontend   │
│  (Student)   │
│  Dashboard   │
└──────┬───────┘
       │
       │ GET /api/students/{studentId}/courses
       │
       ▼
┌──────────────────────┐
│  StudentController   │
│  getEnrolledCourses  │
│  ByStudent           │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  EnrollmentService   │
│  getStudentEnrollments│
└──────┬───────────────┘
       │
       │ 1. Validate student exists
       │ 2. Fetch enrollments
       ▼
┌──────────────────────┐
│ EnrollmentRepository │
│ findByStudentId      │
│ (studentId)          │
└──────┬───────────────┘
       │
       │ Returns: List<Enrollment>
       │
       ▼
┌──────────────────────┐
│  StudentController   │
│  Map enrollments     │
│  to courses          │
│  .map(e -> e.getCourse())
└──────┬───────────────┘
       │
       │ Returns: List<Course>
       │ - Only enrolled courses
       │ - Includes course details
       │
       ▼
┌──────────────────────┐
│  Frontend            │
│  Display enrolled    │
│  courses in          │
│  dashboard           │
└──────────────────────┘
```

---

## Auto-Enrollment Flow

```
┌──────────────────────┐
│  Course Created/     │
│  Updated with        │
│  status="Published"  │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  CourseService       │
│  autoEnrollAllStudents│
└──────┬───────────────┘
       │
       │ 1. Get course.classLevel
       │    (e.g., "10")
       ▼
┌──────────────────────┐
│  StudentRepository   │
│  findByClassLevel    │
│  (classLevel)        │
└──────┬───────────────┘
       │
       │ Returns: List<Student>
       │ - All students in that class
       │
       ▼
┌──────────────────────┐
│  For each student:   │
│  1. Check if already │
│     enrolled         │
│  2. If not, create   │
│     enrollment       │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ EnrollmentRepository │
│ saveAll(enrollments) │
└──────┬───────────────┘
       │
       │ Result: Students enrolled
       │
       ▼
┌──────────────────────┐
│  Students can now    │
│  see course in       │
│  their dashboard     │
└──────────────────────┘
```

---

## API Endpoint Mapping

### Instructor Operations
```
POST   /api/instructors/register
       → Register new instructor

GET    /api/instructors/{id}
       → Get instructor details

GET    /api/instructors/{id}/courses
       → Get instructor's courses (for Manage Course page)

GET    /api/instructors/{id}/students
       → Get students enrolled in instructor's courses

GET    /api/instructors/{id}/dashboard-stats
       → Get dashboard statistics
```

### Course Operations
```
POST   /api/courses/create-with-videos
       → Create course (requires instructorId)

GET    /api/courses
       → Get all courses (for browse/search page)

GET    /api/courses/{id}
       → Get course details

GET    /api/courses/instructor/{instructorId}
       → Get courses by instructor (alternative endpoint)

PUT    /api/courses/{id}/update
       → Update course

DELETE /api/courses/{id}/delete
       → Delete course
```

### Student Operations
```
POST   /api/students
       → Register new student

GET    /api/students/{id}
       → Get student details

GET    /api/students/{id}/courses
       → Get enrolled courses (for Student Dashboard)

GET    /api/students/{id}/enrollments
       → Get enrollments with progress
```

### Enrollment Operations
```
POST   /api/enrollments/enroll
       → Manual enrollment

GET    /api/enrollments/student/{studentId}
       → Get student's enrollments

GET    /api/enrollments/courses/{courseId}
       → Get course enrollments

PUT    /api/enrollments/{id}/progress
       → Update progress

PUT    /api/enrollments/{id}/complete
       → Mark as completed

PUT    /api/enrollments/{id}/drop
       → Drop course
```

---

## Data Flow Summary

### ✅ Correct Flow (Use These)

**Instructor Manage Course:**
```
Frontend → GET /api/instructors/{id}/courses
         → InstructorController
         → InstructorService.getCoursesByInstructor()
         → CourseRepository.findByInstructorId()
         → Returns instructor's courses only
```

**Student My Courses:**
```
Frontend → GET /api/students/{id}/courses
         → StudentController
         → EnrollmentService.getStudentEnrollments()
         → EnrollmentRepository.findByStudentId()
         → Map to courses
         → Returns enrolled courses only
```

### ❌ Incorrect Flow (Don't Use)

**Wrong for Instructor:**
```
Frontend → GET /api/courses  ❌
         → Returns ALL courses (not filtered)
```

**Wrong for Student:**
```
Frontend → GET /api/courses  ❌
         → Returns ALL courses (not enrolled ones)
```

---

## JSON Response Examples

### GET /api/instructors/1/courses
```json
[
  {
    "id": 1,
    "title": "Introduction to Algebra",
    "description": "Learn basic algebra",
    "classLevel": "10",
    "category": "Mathematics",
    "status": "Published",
    "thumbnailPath": "/uploads/1/thumbnail/image.jpg",
    "instructor": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "specialization": "Mathematics"
    },
    "createdAt": "2024-01-01T10:00:00",
    "updatedAt": "2024-01-01T10:00:00"
  }
]
```

### GET /api/students/1/courses
```json
[
  {
    "id": 1,
    "title": "Introduction to Algebra",
    "description": "Learn basic algebra",
    "classLevel": "10",
    "category": "Mathematics",
    "status": "Published",
    "thumbnailPath": "/uploads/1/thumbnail/image.jpg",
    "instructor": {
      "id": 1,
      "name": "John Doe"
    }
  }
]
```

### GET /api/enrollments/student/1
```json
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
      "title": "Introduction to Algebra",
      "description": "Learn basic algebra",
      "thumbnailPath": "/uploads/1/thumbnail/image.jpg"
    },
    "enrollmentDate": "2024-01-01T10:00:00",
    "progressPercentage": 45.5,
    "status": "ENROLLED"
  }
]
```
