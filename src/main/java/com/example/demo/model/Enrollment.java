package com.example.demo.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;

import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "enrollments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Enrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column(name = "enrollment_date", nullable = false, updatable = false)
    private LocalDateTime enrollmentDate;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "progress_percentage")
    private Double progressPercentage = 0.0;

    @Column(nullable = false)
    private String status = "ENROLLED"; // ENROLLED, COMPLETED, DROPPED

    @PrePersist
    protected void onCreate() {
        enrollmentDate = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (progressPercentage == null) {
            progressPercentage = 0.0;
        }
        if (status == null) {
            status = "ENROLLED";
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
