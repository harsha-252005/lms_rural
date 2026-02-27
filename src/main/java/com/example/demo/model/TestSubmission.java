package com.example.demo.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "test_submissions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TestSubmission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long testId;
    
    private Long studentId;
    
    @Column(columnDefinition = "TEXT")
    private String answers; // JSON format: [{questionId, answer}]
    
    private Integer score;
    
    private Integer totalMarks;
    
    @Column(columnDefinition = "TEXT")
    private String evaluation; // JSON format: [{questionId, correct, correctAnswer}]
    
    private LocalDateTime submittedAt;
    
    @PrePersist
    protected void onCreate() {
        submittedAt = LocalDateTime.now();
    }
}
