package com.example.demo.service;

import com.example.demo.model.Instructor;

import java.util.List;
import java.util.Optional;

public interface InstructorService {
    Instructor registerInstructor(Instructor instructor);

    List<Instructor> getAllInstructors();

    Optional<Instructor> getInstructorById(Long id);

    Instructor updateInstructor(Long id, Instructor instructorDetails);

    void removeInstructor(Long id);
}
