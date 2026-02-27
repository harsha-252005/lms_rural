package com.example.demo.controller;

import com.example.demo.model.*;
import com.example.demo.service.AssignmentTestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/instructor")
@RequiredArgsConstructor
public class InstructorAssignmentController {

    private final AssignmentTestService service;

    @PostMapping("/assignments")
    public ResponseEntity<Assignment> createAssignment(@RequestBody Assignment assignment) {
        return ResponseEntity.ok(service.createAssignment(assignment));
    }

    @GetMapping("/assignments")
    public ResponseEntity<List<Assignment>> getMyAssignments(@RequestParam Long instructorId) {
        return ResponseEntity.ok(service.getAssignmentsByInstructor(instructorId));
    }

    @PostMapping("/tests")
    public ResponseEntity<Test> createTest(@RequestBody Test test) {
        return ResponseEntity.ok(service.createTest(test));
    }

    @GetMapping("/tests")
    public ResponseEntity<List<Test>> getMyTests(@RequestParam Long instructorId) {
        return ResponseEntity.ok(service.getTestsByInstructor(instructorId));
    }

    @GetMapping("/assignments/{assignmentId}/submissions")
    public ResponseEntity<List<AssignmentSubmission>> getAssignmentSubmissions(@PathVariable Long assignmentId) {
        return ResponseEntity.ok(service.getAssignmentSubmissions(assignmentId));
    }

    @GetMapping("/tests/{testId}/submissions")
    public ResponseEntity<List<TestSubmission>> getTestSubmissions(@PathVariable Long testId) {
        return ResponseEntity.ok(service.getTestSubmissions(testId));
    }
}
