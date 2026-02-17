package com.example.demo.service;

import com.example.demo.model.Course;
import java.util.List;
import java.util.Optional;

public interface CourseService {
    Course createCourse(Course course);

    List<Course> getAllCourses();

    Optional<Course> getCourseById(Long id);

    Course updateCourse(Long id, Course course);

    void deleteCourse(Long id);
}
