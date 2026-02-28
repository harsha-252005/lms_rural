package com.example.demo.controller;

import com.example.demo.model.Course;
import com.example.demo.model.Enrollment;
import com.example.demo.model.Student;
import com.example.demo.service.EnrollmentService;
import com.example.demo.service.StudentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/students")
@Tag(name = "Student Controller", description = "Operations related to Student management")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;
    private final EnrollmentService enrollmentService;

    @PostMapping
    @Operation(summary = "Register Students")
    public ResponseEntity<Student> createStudent(@Valid @RequestBody Student student) {
        Student createdStudent = studentService.createStudent(student);
        return new ResponseEntity<>(createdStudent, HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Get All Students")
    public ResponseEntity<List<Student>> getAllStudents() {
        return ResponseEntity.ok(studentService.getAllStudents());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get Student By ID")
    public ResponseEntity<Student> getStudentById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(studentService.getStudentById(id));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update Student Details")
    public ResponseEntity<Student> updateStudent(@PathVariable("id") Long id, @RequestBody Student student) {
        return ResponseEntity.ok(studentService.updateStudent(id, student));
    }

    @GetMapping("/{studentId}/courses")
    @Operation(summary = "Get enrolled courses for a student (returns Course objects)")
    public ResponseEntity<List<Course>> getEnrolledCoursesByStudent(@PathVariable("studentId") Long studentId) {
        System.out.println("DEBUG_STUDENT: Fetching courses for studentId=" + studentId);
        List<Course> courses = enrollmentService.getStudentEnrollments(studentId)
                .stream()
                .map(Enrollment::getCourse)
                .collect(Collectors.toList());
        System.out.println("DEBUG_STUDENT: Found " + courses.size() + " courses for studentId=" + studentId);
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/{id}/my-courses")
    @Operation(summary = "Get Enrolled Courses for a Student (DTO response)")
    public ResponseEntity<List<com.example.demo.dto.StudentCourseResponse>> getEnrolledCourses(
            @PathVariable("id") Long id) {
        return ResponseEntity.ok(studentService.getEnrolledCourses(id));
    }

    @GetMapping("/{studentId}/enrollments")
    @Operation(summary = "Get all enrollments of a student")
    public ResponseEntity<List<Enrollment>> getEnrollmentsByStudent(@PathVariable("studentId") Long studentId) {
        return ResponseEntity.ok(enrollmentService.getStudentEnrollments(studentId));
    }
}
