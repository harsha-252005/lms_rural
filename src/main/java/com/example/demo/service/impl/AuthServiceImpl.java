package com.example.demo.service.impl;

import com.example.demo.dto.InstructorRegistrationDto;
import com.example.demo.dto.LoginDto;
import com.example.demo.dto.StudentRegistrationDto;
import com.example.demo.model.Instructor;
import com.example.demo.model.Student;
import com.example.demo.repository.InstructorRepository;
import com.example.demo.repository.StudentRepository;
import com.example.demo.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final StudentRepository studentRepository;
    private final InstructorRepository instructorRepository;

    @Override
    public String registerStudent(StudentRegistrationDto registrationDto) {
        if (studentRepository.existsByEmail(registrationDto.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        Student student = new Student();
        student.setName(registrationDto.getName());
        student.setEmail(registrationDto.getEmail());
        student.setPassword(registrationDto.getPassword()); // Plain text as requested

        // Note: phone and village are required in the entity but not in the DTO
        // Setting placeholders for now as per registration fields provided in
        // requirements
        student.setPhone("N/A");
        student.setVillage("N/A");

        studentRepository.save(student);
        return "Student registered successfully";
    }

    @Override
    public String registerInstructor(InstructorRegistrationDto registrationDto) {
        if (instructorRepository.findByEmail(registrationDto.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        Instructor instructor = new Instructor();
        instructor.setName(registrationDto.getName());
        instructor.setEmail(registrationDto.getEmail());
        instructor.setPassword(registrationDto.getPassword()); // Plain text as requested
        instructor.setSpecialization(registrationDto.getSpecialization());

        instructorRepository.save(instructor);
        return "Instructor registered successfully";
    }

    @Override
    public String login(LoginDto loginDto) {
        if ("STUDENT".equalsIgnoreCase(loginDto.getRole())) {
            Optional<Student> student = studentRepository.findByEmail(loginDto.getEmail());
            if (student.isPresent() && student.get().getPassword().equals(loginDto.getPassword())) {
                return "Login successful for Student";
            }
        } else if ("INSTRUCTOR".equalsIgnoreCase(loginDto.getRole())) {
            Optional<Instructor> instructor = instructorRepository.findByEmail(loginDto.getEmail());
            if (instructor.isPresent() && instructor.get().getPassword().equals(loginDto.getPassword())) {
                return "Login successful for Instructor";
            }
        }

        throw new RuntimeException("Invalid email, password or role");
    }
}
