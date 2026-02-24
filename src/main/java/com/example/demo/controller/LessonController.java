package com.example.demo.controller;

import com.example.demo.model.ContentType;
import com.example.demo.model.Lesson;
import com.example.demo.service.LessonService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@Tag(name = "Lesson Management", description = "APIs for managing lessons within courses")
@RequiredArgsConstructor
public class LessonController {

    private final LessonService lessonService;

    @Operation(summary = "Get all lessons")
    @GetMapping("/lessons")
    public ResponseEntity<List<Lesson>> getAllLessons() {
        List<Lesson> lessons = lessonService.getAllLessons();
        return ResponseEntity.ok(lessons);
    }

    @Operation(summary = "Create a new lesson for a course")
    @PostMapping("/courses/{courseId}/lessons/create")
    public ResponseEntity<Lesson> createLesson(@PathVariable Long courseId, @Valid @RequestBody Lesson lesson) {
        Lesson createdLesson = lessonService.createLesson(courseId, lesson);
        return new ResponseEntity<>(createdLesson, HttpStatus.CREATED);
    }

    @Operation(summary = "Get all lessons for a course")
    @GetMapping("/courses/{courseId}/lessons")
    public ResponseEntity<List<Lesson>> getLessonsByCourse(@PathVariable Long courseId) {
        List<Lesson> lessons = lessonService.getLessonsByCourseId(courseId);
        return ResponseEntity.ok(lessons);
    }

    @Operation(summary = "Get a lesson by ID")
    @GetMapping("/lessons/{lessonId}")
    public ResponseEntity<Lesson> getLessonById(@PathVariable Long lessonId) {
        Lesson lesson = lessonService.getLessonById(lessonId);
        return ResponseEntity.ok(lesson);
    }

    @Operation(summary = "Update an existing lesson")
    @PutMapping("/lessons/{lessonId}/update")
    public ResponseEntity<Lesson> updateLesson(@PathVariable Long lessonId, @Valid @RequestBody Lesson lesson) {
        Lesson updatedLesson = lessonService.updateLesson(lessonId, lesson, lesson.getContentType());
        return ResponseEntity.ok(updatedLesson);
    }

    @Operation(summary = "Delete a lesson")
    @DeleteMapping("/lessons/{lessonId}/delete")
    public ResponseEntity<Void> deleteLesson(@PathVariable Long lessonId) {
        lessonService.deleteLesson(lessonId);
        return ResponseEntity.noContent().build();
    }
}
