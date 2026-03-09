package com.example.demo.controller;

import com.example.demo.model.*;
import com.example.demo.service.AssignmentTestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/instructor")
@RequiredArgsConstructor
public class InstructorAssignmentController {

    private final AssignmentTestService service;

    @PostMapping("/tests/generate")
    public ResponseEntity<String> generateQuestions(@RequestBody Map<String, String> request) {
        String title = request.getOrDefault("title", "");
        String topic = request.getOrDefault("topic", "math");
        String generationTopic = topic;
        if (title != null && !title.isEmpty()) {
            generationTopic = title + " (" + topic + ")";
        }
        System.out.println("DEBUG_CONTROLLER: POST /api/instructor/tests/generate for: " + generationTopic);
        String questions = service.generateQuestions(generationTopic);
        return ResponseEntity.ok(questions);
    }

    @PostMapping("/assignments")
    public ResponseEntity<Assignment> createAssignment(@RequestBody Assignment assignment) {
        System.out.println("DEBUG_CONTROLLER: POST /api/instructor/assignments received: " + assignment);
        return ResponseEntity.ok(service.createAssignment(assignment));
    }

    @GetMapping("/assignments")
    public ResponseEntity<List<Assignment>> getMyAssignments(@RequestParam("instructorId") Long instructorId) {
        System.out.println("DEBUG_CONTROLLER: GET /api/instructor/assignments?instructorId=" + instructorId);
        List<Assignment> assignments = service.getAssignmentsByInstructor(instructorId);
        System.out.println("DEBUG_CONTROLLER: Returning " + assignments.size() + " assignments");
        return ResponseEntity.ok(assignments);
    }

    @PostMapping("/tests")
    public ResponseEntity<Test> createTest(@RequestBody Test test) {
        System.out.println("DEBUG_CONTROLLER: POST /api/instructor/tests received: " + test);
        return ResponseEntity.ok(service.createTest(test));
    }

    @GetMapping("/tests")
    public ResponseEntity<List<Test>> getMyTests(@RequestParam("instructorId") Long instructorId) {
        System.out.println("DEBUG_CONTROLLER: GET /api/instructor/tests?instructorId=" + instructorId);
        return ResponseEntity.ok(service.getTestsByInstructor(instructorId));
    }

    @GetMapping("/assignments/{assignmentId}/submissions")
    public ResponseEntity<List<AssignmentSubmission>> getAssignmentSubmissions(
            @PathVariable("assignmentId") Long assignmentId) {
        return ResponseEntity.ok(service.getAssignmentSubmissions(assignmentId));
    }

    @GetMapping("/tests/{testId}/submissions")
    public ResponseEntity<List<TestSubmission>> getTestSubmissions(@PathVariable("testId") Long testId) {
        return ResponseEntity.ok(service.getTestSubmissions(testId));
    }

    // DEBUG ENDPOINTS
    @GetMapping("/debug/all-tests")
    public ResponseEntity<List<Test>> getAllTestsDebug() {
        System.out.println("DEBUG_CONTROLLER: GET /api/instructor/debug/all-tests");
        return ResponseEntity.ok(service.getAllTestsDebug());
    }

    @GetMapping("/debug/all-assignments")
    public ResponseEntity<List<Assignment>> getAllAssignmentsDebug() {
        System.out.println("DEBUG_CONTROLLER: GET /api/instructor/debug/all-assignments");
        return ResponseEntity.ok(service.getAllAssignmentsDebug());
    }
}
