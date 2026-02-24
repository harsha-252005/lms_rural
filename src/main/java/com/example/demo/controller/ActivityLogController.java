package com.example.demo.controller;

import com.example.demo.model.ActivityLog;
import com.example.demo.repository.ActivityLogRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activity-logs")
@CrossOrigin(origins = "*")
@Tag(name = "Activity Log Controller", description = "Operations related to user activity tracking")
@RequiredArgsConstructor
public class ActivityLogController {

    private final ActivityLogRepository activityLogRepository;

    @GetMapping
    @Operation(summary = "Get all activity logs (Logins and Registrations)")
    public ResponseEntity<List<ActivityLog>> getAllActivityLogs() {
        return ResponseEntity.ok(activityLogRepository.findAll());
    }
}
