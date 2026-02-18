package com.example.demo.service;

import com.example.demo.model.Enrollment;

import java.util.List;

public interface EnrollmentService {
    Enrollment enrollStudent(Long studentId, Long courseId);

    Enrollment updateProgress(Long enrollmentId, Double progress);

    Enrollment completeCourse(Long enrollmentId);

    Enrollment dropCourse(Long enrollmentId);

    List<Enrollment> getAllEnrollments();

    List<Enrollment> getStudentEnrollments(Long studentId);

    List<Enrollment> getCourseEnrollments(Long courseId);
}
