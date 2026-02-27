package com.example.demo.repository;

import com.example.demo.model.TestSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface TestSubmissionRepository extends JpaRepository<TestSubmission, Long> {
    List<TestSubmission> findByTestId(Long testId);
    List<TestSubmission> findByStudentId(Long studentId);
    Optional<TestSubmission> findByTestIdAndStudentId(Long testId, Long studentId);
}
