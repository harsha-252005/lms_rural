package com.example.demo.controller;

import com.example.demo.model.*;
import com.example.demo.service.AssignmentTestService;
import com.example.demo.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student")
@RequiredArgsConstructor
public class StudentAssignmentController {

    private final AssignmentTestService service;
    private final StudentRepository studentRepository;

    @GetMapping("/{studentId}/assignments")
    public ResponseEntity<List<Assignment>> getMyAssignments(@PathVariable Long studentId) {
        Student student = studentRepository.findById(studentId).orElseThrow();
        return ResponseEntity.ok(service.getAssignmentsByClass(student.getClassLevel()));
    }

    @GetMapping("/{studentId}/tests")
    public ResponseEntity<List<Test>> getMyTests(@PathVariable Long studentId) {
        Student student = studentRepository.findById(studentId).orElseThrow();
        return ResponseEntity.ok(service.getTestsByClass(student.getClassLevel()));
    }

    @PostMapping("/assignments/submit")
    public ResponseEntity<AssignmentSubmission> submitAssignment(@RequestBody AssignmentSubmission submission) {
        return ResponseEntity.ok(service.submitAssignment(submission));
    }

    @PostMapping("/tests/submit")
    public ResponseEntity<TestSubmission> submitTest(@RequestBody TestSubmission submission) {
        return ResponseEntity.ok(service.submitTest(submission));
    }

    @GetMapping("/{studentId}/assignment-submissions")
    public ResponseEntity<List<AssignmentSubmission>> getMyAssignmentSubmissions(@PathVariable Long studentId) {
        return ResponseEntity.ok(service.getStudentAssignmentSubmissions(studentId));
    }

    @GetMapping("/{studentId}/test-submissions")
    public ResponseEntity<List<TestSubmission>> getMyTestSubmissions(@PathVariable Long studentId) {
        return ResponseEntity.ok(service.getStudentTestSubmissions(studentId));
    }
}
