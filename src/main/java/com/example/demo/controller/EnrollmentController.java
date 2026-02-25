package com.example.demo.controller;

import com.example.demo.model.Enrollment;
import com.example.demo.service.EnrollmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enrollments")
@RequiredArgsConstructor
@Tag(name = "Enrollment Controller", description = "Operations related to Enrollment management")
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    @PostMapping("/enroll")
    @Operation(summary = "Enroll student to a course")
    public ResponseEntity<Enrollment> enrollStudent(@RequestBody EnrollmentRequest request) {
        Enrollment enrollment = enrollmentService.enrollStudent(request.getStudentId(), request.getCourseId());
        return new ResponseEntity<>(enrollment, HttpStatus.CREATED);
    }

    @PutMapping("/{enrollmentId}/progress")
    @Operation(summary = "Update progress percentage")
    public ResponseEntity<Enrollment> updateProgress(@PathVariable("enrollmentId") Long enrollmentId,
            @RequestBody Double progress) {
        Enrollment enrollment = enrollmentService.updateProgress(enrollmentId, progress);
        return ResponseEntity.ok(enrollment);
    }

    @PutMapping("/{enrollmentId}/complete")
    @Operation(summary = "Mark course as COMPLETED")
    public ResponseEntity<Enrollment> completeCourse(@PathVariable("enrollmentId") Long enrollmentId) {
        Enrollment enrollment = enrollmentService.completeCourse(enrollmentId);
        return ResponseEntity.ok(enrollment);
    }

    @PutMapping("/{enrollmentId}/drop")
    @Operation(summary = "Mark course as DROPPED")
    public ResponseEntity<Enrollment> dropCourse(@PathVariable("enrollmentId") Long enrollmentId) {
        Enrollment enrollment = enrollmentService.dropCourse(enrollmentId);
        return ResponseEntity.ok(enrollment);
    }

    @GetMapping
    @Operation(summary = "Get all enrollments")
    public ResponseEntity<List<Enrollment>> getAllEnrollments() {
        return ResponseEntity.ok(enrollmentService.getAllEnrollments());
    }

    @GetMapping({ "/student/{studentId}", "/students/{studentId}" })
    @Operation(summary = "Get all enrollments of a student")
    public ResponseEntity<List<Enrollment>> getEnrollmentsByStudent(@PathVariable("studentId") Long studentId) {
        return ResponseEntity.ok(enrollmentService.getStudentEnrollments(studentId));
    }

    @GetMapping("/courses/{courseId}")
    @Operation(summary = "Get all enrollments for a course")
    public ResponseEntity<List<Enrollment>> getEnrollmentsByCourse(@PathVariable("courseId") Long courseId) {
        return ResponseEntity.ok(enrollmentService.getCourseEnrollments(courseId));
    }

    @Data
    public static class EnrollmentRequest {
        private Long studentId;
        private Long courseId;

        public Long getStudentId() {
            return studentId;
        }

        public Long getCourseId() {
            return courseId;
        }

        public void setStudentId(Long studentId) {
            this.studentId = studentId;
        }

        public void setCourseId(Long courseId) {
            this.courseId = courseId;
        }
    }
}
