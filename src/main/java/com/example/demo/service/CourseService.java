package com.example.demo.service;

import com.example.demo.model.Course;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

public interface CourseService {
    Course createCourse(Course course, Long instructorId);

    Course createCourseWithVideos(String title, String description, String classLevel,
            String category, String status, Long instructorId,
            MultipartFile thumbnail, List<MultipartFile> videos);

    List<Course> getAllCourses();

    Optional<Course> getCourseById(Long id);

    Course updateCourse(Long id, Course course);

    void deleteCourse(Long id);

    List<Course> getCoursesByInstructor(Long instructorId);
}
