package com.example.demo.service.impl;

import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.Instructor;
import com.example.demo.repository.InstructorRepository;
import com.example.demo.service.InstructorService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class InstructorServiceImpl implements InstructorService {

    private final InstructorRepository instructorRepository;

    @Override
    public Instructor registerInstructor(Instructor instructor) {
        if (instructorRepository.findByEmail(instructor.getEmail()).isPresent()) {
            throw new RuntimeException("Instructor with email " + instructor.getEmail() + " already exists");
        }
        return instructorRepository.save(instructor);
    }

    @Override
    public List<Instructor> getAllInstructors() {
        return instructorRepository.findAll();
    }

    @Override
    public Optional<Instructor> getInstructorById(Long id) {
        return instructorRepository.findById(id);
    }

    @Override
    public Instructor updateInstructor(Long id, Instructor instructorDetails) {
        return instructorRepository.findById(id).map(instructor -> {
            instructor.setName(instructorDetails.getName());
            instructor.setEmail(instructorDetails.getEmail());
            instructor.setSpecialization(instructorDetails.getSpecialization());
            return instructorRepository.save(instructor);
        }).orElseThrow(() -> new ResourceNotFoundException("Instructor not found with id " + id));
    }

    @Override
    public void removeInstructor(Long id) {
        if (!instructorRepository.existsById(id)) {
            throw new ResourceNotFoundException("Instructor not found with id " + id);
        }
        instructorRepository.deleteById(id);
    }
}
