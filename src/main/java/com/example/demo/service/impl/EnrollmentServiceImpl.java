package com.example.demo.service.impl;

import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.Course;
import com.example.demo.model.Enrollment;
import com.example.demo.model.Student;
import com.example.demo.repository.CourseRepository;
import com.example.demo.repository.EnrollmentRepository;
import com.example.demo.repository.StudentRepository;
import com.example.demo.service.EnrollmentService;
import com.example.demo.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EnrollmentServiceImpl implements EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;
    private final NotificationService notificationService;

    @Override
    public Enrollment enrollStudent(Long studentId, Long courseId) {
        if (enrollmentRepository.existsByStudentIdAndCourseId(studentId, courseId)) {
            throw new RuntimeException("Student is already enrolled in this course");
        }

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + courseId));

        Enrollment enrollment = new Enrollment();
        enrollment.setStudent(student);
        enrollment.setCourse(course);
        enrollment.setProgressPercentage(0.0);
        enrollment.setStatus("ENROLLED");
        // date set by @PrePersist
        Enrollment savedEnrollment = enrollmentRepository.save(enrollment);

        // Create notification for instructor
        if (course.getInstructor() != null) {
            String message = String.format("New student %s has enrolled in your course: %s", student.getName(), course.getTitle());
            notificationService.createNotification(course.getInstructor().getId(), message, "ENROLLMENT");
        }

        return savedEnrollment;
    }

    @Override
    public Enrollment updateProgress(Long enrollmentId, Double progress) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found with id: " + enrollmentId));

        if (progress < 0 || progress > 100) {
            throw new IllegalArgumentException("Progress must be between 0 and 100");
        }

        enrollment.setProgressPercentage(progress);
        if (progress == 100.0) {
            enrollment.setStatus("COMPLETED");
        }
        return enrollmentRepository.save(enrollment);
    }

    @Override
    public Enrollment completeCourse(Long enrollmentId) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found with id: " + enrollmentId));

        enrollment.setProgressPercentage(100.0);
        enrollment.setStatus("COMPLETED");
        return enrollmentRepository.save(enrollment);
    }

    @Override
    public Enrollment dropCourse(Long enrollmentId) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found with id: " + enrollmentId));

        enrollment.setStatus("DROPPED");
        return enrollmentRepository.save(enrollment);
    }

    @Override
    public List<Enrollment> getAllEnrollments() {
        return enrollmentRepository.findAll();
    }

    @Override
    public List<Enrollment> getStudentEnrollments(Long studentId) {
        if (!studentRepository.existsById(studentId)) {
            throw new ResourceNotFoundException("Student not found with id: " + studentId);
        }
        return enrollmentRepository.findByStudentId(studentId);
    }

    @Override
    public List<Enrollment> getCourseEnrollments(Long courseId) {
        if (!courseRepository.existsById(courseId)) {
            throw new ResourceNotFoundException("Course not found with id: " + courseId);
        }
        return enrollmentRepository.findByCourseId(courseId);
    }
}
