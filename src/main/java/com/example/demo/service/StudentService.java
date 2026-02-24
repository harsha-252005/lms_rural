package com.example.demo.service;

import com.example.demo.dto.StudentCourseResponse;
import com.example.demo.model.Student;
import java.util.List;

public interface StudentService {
    Student createStudent(Student student);

    List<Student> getAllStudents();

    Student getStudentById(Long id);

    Student updateStudent(Long id, Student student);

    void deleteStudent(Long id);

    List<StudentCourseResponse> getEnrolledCourses(Long studentId);
}
