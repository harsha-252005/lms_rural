package com.example.demo.repository;

import com.example.demo.model.Test;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TestRepository extends JpaRepository<Test, Long> {
    List<Test> findByClassLevel(String classLevel);
    List<Test> findByInstructorId(Long instructorId);
}
