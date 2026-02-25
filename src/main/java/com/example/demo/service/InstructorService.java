package com.example.demo.service;

import com.example.demo.model.Course;
import com.example.demo.model.Instructor;

import java.util.List;
import java.util.Optional;

public interface InstructorService {
    Instructor registerInstructor(Instructor instructor);

    List<Instructor> getAllInstructors();

    Optional<Instructor> getInstructorById(Long id);

    Instructor updateInstructor(Long id, Instructor instructorDetails);

    void changePassword(Long id, String oldPassword, String newPassword);

    java.util.Map<String, Object> getDashboardStats(Long id);

    List<com.example.demo.model.Enrollment> getEnrolledStudents(Long instructorId);

    void removeInstructor(Long id);

    List<Course> getCoursesByInstructor(Long instructorId);
}
