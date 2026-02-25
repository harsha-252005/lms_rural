package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseResponseDto {
    private Long id;
    private String title;
    private String description;
    private String duration;
    private String classLevel;
    private String category;
    private String status;
    private String thumbnailPath;
    private Long instructorId;
    private String instructorName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
