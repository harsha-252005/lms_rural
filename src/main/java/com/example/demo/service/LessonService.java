package com.example.demo.service;

import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.Course;
import com.example.demo.model.ContentType;
import com.example.demo.model.Lesson;
import com.example.demo.repository.CourseRepository;
import com.example.demo.repository.LessonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LessonService {

    private final LessonRepository lessonRepository;
    private final CourseRepository courseRepository;

    @Transactional
    public Lesson createLesson(Long courseId, Lesson lesson) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + courseId));

        lesson.setCourse(course);
        return lessonRepository.save(lesson);
    }

    public List<Lesson> getLessonsByCourseId(Long courseId) {
        if (!courseRepository.existsById(courseId)) {
            throw new ResourceNotFoundException("Course not found with id: " + courseId);
        }
        return lessonRepository.findByCourseIdOrderByOrderIndexAsc(courseId);
    }

    public List<Lesson> getAllLessons() {
        return lessonRepository.findAll();
    }

    public Lesson getLessonById(Long lessonId) {
        return lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found with id: " + lessonId));
    }

    @Transactional
    public Lesson updateLesson(Long lessonId, Lesson updatedLesson, ContentType contentType) {
        Lesson existingLesson = getLessonById(lessonId);

        existingLesson.setTitle(updatedLesson.getTitle());
        existingLesson.setContentType(updatedLesson.getContentType());
        existingLesson.setContentUrl(updatedLesson.getContentUrl());
        existingLesson.setOrderIndex(updatedLesson.getOrderIndex());

        return lessonRepository.save(existingLesson);
    }

    @Transactional
    public void deleteLesson(Long lessonId) {
        if (!lessonRepository.existsById(lessonId)) {
            throw new ResourceNotFoundException("Lesson not found with id: " + lessonId);
        }
        lessonRepository.deleteById(lessonId);
    }
}
