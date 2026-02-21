package com.example.demo.service;

import com.example.demo.dto.InstructorRegistrationDto;
import com.example.demo.dto.LoginDto;
import com.example.demo.dto.StudentRegistrationDto;

public interface AuthService {
    String registerStudent(StudentRegistrationDto registrationDto);

    String registerInstructor(InstructorRegistrationDto registrationDto);

    String login(LoginDto loginDto);
}
