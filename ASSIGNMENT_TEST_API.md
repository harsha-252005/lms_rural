# Assignment & Test System API Guide

## Instructor APIs

### 1. Create Assignment
POST http://localhost:8080/api/instructor/assignments
```json
{
  "title": "Math Homework",
  "description": "Complete exercises 1-10",
  "classLevel": "10",
  "instructorId": 1,
  "dueDate": "2026-03-15T23:59:59"
}
```

### 2. Create Test (Auto-generates questions based on topic)
POST http://localhost:8080/api/instructor/tests
```json
{
  "title": "Math Quiz",
  "topic": "math",
  "classLevel": "10",
  "instructorId": 1,
  "totalMarks": 10,
  "dueDate": "2026-03-10T23:59:59"
}
```
Topics: math, science, english

### 3. View My Assignments
GET http://localhost:8080/api/instructor/assignments?instructorId=1

### 4. View My Tests
GET http://localhost:8080/api/instructor/tests?instructorId=1

### 5. View Assignment Submissions
GET http://localhost:8080/api/instructor/assignments/1/submissions

### 6. View Test Submissions (Auto-evaluated with scores)
GET http://localhost:8080/api/instructor/tests/1/submissions

## Student APIs

### 1. View My Assignments
GET http://localhost:8080/api/student/2/assignments

### 2. View My Tests
GET http://localhost:8080/api/student/2/tests

### 3. Submit Assignment
POST http://localhost:8080/api/student/assignments/submit
```json
{
  "assignmentId": 1,
  "studentId": 2,
  "content": "My assignment answers here..."
}
```

### 4. Submit Test (Auto-evaluated)
POST http://localhost:8080/api/student/tests/submit
```json
{
  "testId": 1,
  "studentId": 2,
  "answers": [
    {"questionId": 0, "answer": "42"},
    {"questionId": 1, "answer": "56"},
    {"questionId": 2, "answer": "25"}
  ]
}
```

### 5. View My Assignment Submissions
GET http://localhost:8080/api/student/2/assignment-submissions

### 6. View My Test Results
GET http://localhost:8080/api/student/2/test-submissions

## Features
✅ Instructor creates assignments for specific class
✅ Instructor creates tests - questions AUTO-GENERATED based on topic
✅ Students see assignments/tests for their class level
✅ Students submit assignments
✅ Students take tests and submit answers
✅ Tests are AUTO-EVALUATED with score calculation
✅ Instructor sees all submissions with scores
✅ Correct answers sent to instructor in evaluation
