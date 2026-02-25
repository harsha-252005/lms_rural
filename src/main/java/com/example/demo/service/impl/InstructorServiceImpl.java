package com.example.demo.service.impl;

import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.Instructor;
import com.example.demo.repository.CourseRepository;
import com.example.demo.repository.EnrollmentRepository;
import com.example.demo.repository.InstructorRepository;
import com.example.demo.service.InstructorService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class InstructorServiceImpl implements InstructorService {

    private final InstructorRepository instructorRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;

    @Override
    public Instructor registerInstructor(Instructor instructor) {
        if (instructorRepository.findByEmail(instructor.getEmail()).isPresent()) {
            throw new RuntimeException("Instructor with email " + instructor.getEmail() + " already exists");
        }
        return instructorRepository.save(instructor);
    }

    @Override
    public List<Instructor> getAllInstructors() {
        return instructorRepository.findAll();
    }

    @Override
    public Optional<Instructor> getInstructorById(Long id) {
        return instructorRepository.findById(id);
    }

    @Override
    public Instructor updateInstructor(Long id, Instructor instructorDetails) {
        return instructorRepository.findById(id).map(instructor -> {
            instructor.setName(instructorDetails.getName());
            instructor.setEmail(instructorDetails.getEmail());
            instructor.setSpecialization(instructorDetails.getSpecialization());
            return instructorRepository.save(instructor);
        }).orElseThrow(() -> new ResourceNotFoundException("Instructor not found with id " + id));
    }

    @Override
    public void changePassword(Long id, String oldPassword, String newPassword) {
        Instructor instructor = instructorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Instructor not found with id " + id));

        if (!instructor.getPassword().equals(oldPassword)) {
            throw new RuntimeException("Current password does not match");
        }

        instructor.setPassword(newPassword);
        instructorRepository.save(instructor);
    }

    @Override
    public Map<String, Object> getDashboardStats(Long id) {
        if (!instructorRepository.existsById(id)) {
            throw new ResourceNotFoundException("Instructor not found with id " + id);
        }

        long totalCourses = courseRepository.countByInstructorId(id);
        
        // Count unique students enrolled in any of this instructor's courses
        // Note: This requires a custom query or fetching courses and then enrollments
        // For simplicity and matching current repository capabilities, we'll fetch course IDs
        List<Long> courseIds = courseRepository.findByInstructorId(id).stream()
                .map(com.example.demo.model.Course::getId)
                .toList();

        long totalStudents = 0;
        if (!courseIds.isEmpty()) {
            totalStudents = enrollmentRepository.countByCourseIdIn(courseIds);
        }

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalCourses", totalCourses);
        stats.put("totalStudents", totalStudents);
        return stats;
    }

    @Override
    public List<com.example.demo.model.Enrollment> getEnrolledStudents(Long instructorId) {
        if (!instructorRepository.existsById(instructorId)) {
            throw new ResourceNotFoundException("Instructor not found with id " + instructorId);
        }
        return enrollmentRepository.findByCourseInstructorId(instructorId);
    }

    @Override
    public void removeInstructor(Long id) {
        if (!instructorRepository.existsById(id)) {
            throw new ResourceNotFoundException("Instructor not found with id " + id);
        }
        instructorRepository.deleteById(id);
    }

    @Override
    public List<com.example.demo.model.Course> getCoursesByInstructor(Long instructorId) {
        System.out.println("DEBUG_INSTRUCTOR_SERVICE: Fetching courses for instructorId=" + instructorId);
        if (!instructorRepository.existsById(instructorId)) {
            throw new ResourceNotFoundException("Instructor not found with id " + instructorId);
        }
        List<com.example.demo.model.Course> courses = courseRepository.findByInstructorId(instructorId);
        System.out.println("DEBUG_INSTRUCTOR_SERVICE: Found " + courses.size() + " courses for instructorId=" + instructorId);
        return courses;
    }
}
