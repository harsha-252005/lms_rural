package com.example.demo.controller;

import com.example.demo.model.Course;
import com.example.demo.service.CourseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@Tag(name = "Course Management", description = "APIs for managing courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    @PostMapping(value = "/create-with-videos", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Create a course with thumbnail and videos")
    public ResponseEntity<Course> createCourseWithVideos(
            @RequestParam("courseTitle") String courseTitle,
            @RequestParam("description") String description,
            @RequestParam("classLevel") String classLevel,
            @RequestParam("category") String category,
            @RequestParam(value = "status", defaultValue = "Draft") String status,
            @RequestParam("instructorId") Long instructorId,
            @RequestPart(value = "thumbnail", required = false) MultipartFile thumbnail,
            @RequestPart(value = "videos", required = false) List<MultipartFile> videos) {

        Course course = courseService.createCourseWithVideos(
                courseTitle, description, classLevel, category, status,
                instructorId, thumbnail, videos);
        return ResponseEntity.ok(course);
    }

    @GetMapping
    @Operation(summary = "Get all courses")
    public ResponseEntity<List<Course>> getAllCourses() {
        List<Course> courses = courseService.getAllCourses();
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/{courseId}")
    @Operation(summary = "Get course details by ID")
    public ResponseEntity<Course> getCourseById(@PathVariable("courseId") Long courseId) {
        return courseService.getCourseById(courseId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{courseId}/update")
    @Operation(summary = "Update course details")
    public ResponseEntity<Course> updateCourse(@PathVariable("courseId") Long courseId,
            @RequestBody Course courseDetails) {
        try {
            Course updatedCourse = courseService.updateCourse(courseId, courseDetails);
            return ResponseEntity.ok(updatedCourse);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{courseId}/delete")
    @Operation(summary = "Delete a course")
    public ResponseEntity<Void> deleteCourse(@PathVariable("courseId") Long courseId) {
        try {
            courseService.deleteCourse(courseId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/instructor/{instructorId}")
    @Operation(summary = "Get courses by instructor ID")
    public ResponseEntity<List<Course>> getCoursesByInstructor(@PathVariable("instructorId") Long instructorId) {
        System.out.println("DEBUG_COURSE: Fetching courses for instructor ID: " + instructorId);
        System.out.flush();
        List<Course> courses = courseService.getCoursesByInstructor(instructorId);
        System.out.println("DEBUG_COURSE: Found " + courses.size() + " courses for ID: " + instructorId);
        System.out.flush();
        return ResponseEntity.ok(courses);
    }
}
