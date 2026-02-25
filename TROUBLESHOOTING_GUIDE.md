# Troubleshooting Guide - LMS Integration

## Issue 1: Course Created but Not Visible in Manage Course Page

### Symptoms:
- Course is created successfully (returns 200 OK)
- Course exists in database
- But doesn't appear in instructor's "Manage Course" page

### Root Cause:
Frontend is calling wrong API endpoint

### Solution:
```javascript
// ❌ WRONG
fetch('/api/courses')  // Returns ALL courses

// ✅ CORRECT
fetch(`/api/instructors/${instructorId}/courses`)  // Returns only instructor's courses
```

### Verification:
1. Open browser console
2. Check which API is being called
3. Verify instructorId is being passed correctly
4. Test API directly: `http://localhost:8080/api/instructors/1/courses`

---

## Issue 2: Student Dashboard Shows No Courses

### Symptoms:
- Student is enrolled in courses
- Enrollment exists in database
- But dashboard shows empty list

### Root Cause:
Frontend is calling wrong API endpoint

### Solution:
```javascript
// ❌ WRONG
fetch('/api/courses')  // Returns ALL courses, not filtered

// ✅ CORRECT
fetch(`/api/students/${studentId}/courses`)  // Returns only enrolled courses
```

### Verification:
1. Check database: `SELECT * FROM enrollments WHERE student_id = 1;`
2. Test API: `http://localhost:8080/api/students/1/courses`
3. Check console logs for `DEBUG_STUDENT:` messages

---

## Issue 3: Course Created Without Instructor

### Symptoms:
- Error: "Instructor not found"
- Course creation fails

### Root Cause:
instructorId not included in request or is null/invalid

### Solution:
```javascript
// ✅ Always include instructorId
formData.append('instructorId', instructorId);

// Verify instructorId is not null
console.log('Creating course for instructor:', instructorId);
```

### Verification:
1. Check if instructor exists: `http://localhost:8080/api/instructors/{id}`
2. Verify instructorId in localStorage or session
3. Check backend logs for `DEBUG_COURSE:` messages

---

## Issue 4: JSON Serialization Error (Infinite Recursion)

### Symptoms:
- Error: "Could not write JSON"
- Stack overflow error
- Circular reference error

### Root Cause:
Entities have circular references (Course → Instructor → Courses)

### Solution:
✅ Already fixed with @JsonIgnore and @JsonIgnoreProperties

### Verification:
1. Check entity annotations are present
2. Restart Spring Boot application
3. Test API endpoints

---

## Issue 5: Lazy Loading Exception

### Symptoms:
- Error: "could not initialize proxy - no Session"
- "failed to lazily initialize a collection"

### Root Cause:
Trying to access lazy-loaded collection outside transaction

### Solution:
✅ Already fixed - using repository methods instead of lazy collections

```java
// ❌ WRONG
instructor.getCourses()  // Lazy loading issue

// ✅ CORRECT
courseRepository.findByInstructorId(instructorId)  // Proper fetch
```

---

## Issue 6: Auto-Enrollment Not Working

### Symptoms:
- Course is published
- Students exist with matching classLevel
- But students are not enrolled

### Root Cause:
Course status is not "Published" or classLevel doesn't match

### Solution:
1. Verify course status is exactly "Published" (case-sensitive)
2. Verify student classLevel matches course classLevel
3. Check logs for `DEBUG_ENROLL:` messages

```javascript
// ✅ Correct status
formData.append('status', 'Published');  // Capital P

// ❌ Wrong status
formData.append('status', 'published');  // lowercase p
```

### Verification:
```sql
-- Check course
SELECT id, title, class_level, status FROM courses WHERE id = 1;

-- Check students
SELECT id, name, class_level FROM students WHERE class_level = '10';

-- Check enrollments
SELECT * FROM enrollments WHERE course_id = 1;
```

---

## Issue 7: Database Connection Failed

### Symptoms:
- Error: "Communications link failure"
- "Access denied for user 'root'"

### Solution:
1. Start MySQL service:
   ```bash
   # Windows
   net start MySQL80
   
   # Or use MySQL Workbench
   ```

2. Verify credentials in application.properties:
   ```properties
   spring.datasource.username=root
   spring.datasource.password=root
   spring.datasource.url=jdbc:mysql://localhost:3306/lms_db
   ```

3. Test connection:
   ```bash
   mysql -u root -p
   # Enter password: root
   ```

---

## Issue 8: File Upload Failed

### Symptoms:
- Error: "Maximum upload size exceeded"
- Thumbnail or videos not saved

### Solution:
✅ Already configured in application.properties:
```properties
spring.servlet.multipart.max-file-size=500MB
spring.servlet.multipart.max-request-size=1GB
```

### Verification:
1. Check file size
2. Verify `uploads/` directory exists
3. Check file permissions

---

## Issue 9: CORS Error in Frontend

### Symptoms:
- Error: "CORS policy: No 'Access-Control-Allow-Origin' header"
- API calls fail from frontend

### Solution:
✅ Already configured in WebConfig.java

If still having issues, verify:
```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:5173", "http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowCredentials(true);
    }
}
```

---

## Issue 10: Port Already in Use

### Symptoms:
- Error: "Port 8080 is already in use"
- Application won't start

### Solution:
1. Find process using port 8080:
   ```bash
   # Windows
   netstat -ano | findstr :8080
   
   # Kill process
   taskkill /PID <PID> /F
   ```

2. Or change port in application.properties:
   ```properties
   server.port=8081
   ```

---

## Debugging Checklist

### Backend Logs to Check:
```
DEBUG_COURSE: Creating course for instructor ID: X
DEBUG_COURSE: Course saved successfully with ID: Y
DEBUG_COURSE: Fetching courses for instructor ID: X
DEBUG_COURSE: Found N courses for instructor ID: X

DEBUG_INSTRUCTOR: Fetching courses for instructorId=X
DEBUG_INSTRUCTOR_SERVICE: Fetching courses for instructorId=X
DEBUG_INSTRUCTOR_SERVICE: Found N courses for instructorId=X

DEBUG_STUDENT: Fetching courses for studentId=X
DEBUG_STUDENT: Found N courses for studentId=X

DEBUG_ENROLLMENT: Fetching enrollments for studentId=X
DEBUG_ENROLLMENT: Found N enrollments for studentId=X

DEBUG_ENROLL: Starting auto-enrollment for course: Title (ID: X) Class: 10
DEBUG_ENROLL: Found N students for class level 10
DEBUG_ENROLL: Enrolling student: Name (ID: X)
DEBUG_ENROLL: Successfully saved N new enrollments
```

### Database Queries to Run:
```sql
-- Check instructors
SELECT * FROM instructors;

-- Check courses
SELECT c.id, c.title, c.class_level, c.status, c.instructor_id, i.name as instructor_name
FROM courses c
LEFT JOIN instructors i ON c.instructor_id = i.id;

-- Check students
SELECT * FROM students;

-- Check enrollments
SELECT e.id, s.name as student_name, c.title as course_title, e.status, e.progress_percentage
FROM enrollments e
JOIN students s ON e.student_id = s.id
JOIN courses c ON e.course_id = c.id;

-- Check courses by instructor
SELECT * FROM courses WHERE instructor_id = 1;

-- Check enrollments by student
SELECT * FROM enrollments WHERE student_id = 1;
```

### API Testing Commands:
```bash
# Test instructor courses
curl http://localhost:8080/api/instructors/1/courses

# Test student courses
curl http://localhost:8080/api/students/1/courses

# Test all courses
curl http://localhost:8080/api/courses

# Test enrollments
curl http://localhost:8080/api/enrollments/student/1
```

---

## Quick Fixes

### Clear Database and Start Fresh:
```sql
DROP DATABASE lms_db;
CREATE DATABASE lms_db;
```
Then restart application (tables will be auto-created)

### Restart Application:
1. Stop Spring Boot (Ctrl+C)
2. Clean build: `mvn clean install`
3. Start again: `mvn spring-boot:run`

### Clear Browser Cache:
1. Open DevTools (F12)
2. Right-click refresh button
3. Select "Empty Cache and Hard Reload"

---

## Getting Help

If issues persist:

1. Check console logs (both frontend and backend)
2. Check database state with SQL queries
3. Test APIs directly with curl or Postman
4. Verify all files are saved and application is restarted
5. Check REFACTORING_SUMMARY.md for complete changes
6. Review API_TESTING_GUIDE.md for correct API usage

### Log Files to Check:
- Backend console output
- Browser console (F12)
- Network tab in DevTools
- MySQL error logs

### Information to Provide:
- Exact error message
- API endpoint being called
- Request payload
- Response status code
- Console logs (DEBUG_ messages)
- Database state (relevant tables)
