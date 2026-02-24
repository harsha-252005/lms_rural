package com.example.demo.controller;

import com.example.demo.model.Instructor;
import com.example.demo.model.Enrollment;
import com.example.demo.service.InstructorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.model.Enrollment;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/instructors")
@Tag(name = "Instructor Management", description = "APIs for managing instructors")
@RequiredArgsConstructor
public class InstructorController {

    private final InstructorService instructorService;

    @PostMapping("/register")
    @Operation(summary = "Register a new instructor")
    public ResponseEntity<Instructor> registerInstructor(@Valid @RequestBody Instructor instructor) {
        Instructor newInstructor = instructorService.registerInstructor(instructor);
        return new ResponseEntity<>(newInstructor, HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Get all instructors")
    public ResponseEntity<List<Instructor>> getAllInstructors() {
        return ResponseEntity.ok(instructorService.getAllInstructors());
    }

    @GetMapping("/{instructorId}")
    @Operation(summary = "Get instructor details")
    public ResponseEntity<Instructor> getInstructorById(@PathVariable Long instructorId) {
        return instructorService.getInstructorById(instructorId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{instructorId}/update")
    @Operation(summary = "Update instructor details")
    public ResponseEntity<Instructor> updateInstructor(@PathVariable Long instructorId,
            @Valid @RequestBody Instructor instructorDetails) {
        try {
            Instructor updatedInstructor = instructorService.updateInstructor(instructorId, instructorDetails);
            return ResponseEntity.ok(updatedInstructor);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{instructorId}/remove")
    @Operation(summary = "Remove instructor")
    public ResponseEntity<Void> removeInstructor(@PathVariable Long instructorId) {
        try {
            instructorService.removeInstructor(instructorId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{instructorId}/change-password")
    @Operation(summary = "Change instructor password")
    public ResponseEntity<String> changePassword(@PathVariable Long instructorId,
            @RequestParam String oldPassword, @RequestParam String newPassword) {
        try {
            instructorService.changePassword(instructorId, oldPassword, newPassword);
            return ResponseEntity.ok("Password changed successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{instructorId}/dashboard-stats")
    @Operation(summary = "Get instructor dashboard statistics")
    public ResponseEntity<Map<String, Object>> getDashboardStats(@PathVariable Long instructorId) {
        try {
            return ResponseEntity.ok(instructorService.getDashboardStats(instructorId));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{instructorId}/students")
    @Operation(summary = "Get students enrolled in instructor's courses")
    public ResponseEntity<List<Enrollment>> getEnrolledStudents(@PathVariable Long instructorId) {
        try {
            return ResponseEntity.ok(instructorService.getEnrolledStudents(instructorId));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
