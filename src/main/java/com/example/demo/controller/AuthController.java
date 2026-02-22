package com.example.demo.controller;

import com.example.demo.dto.InstructorRegistrationDto;
import com.example.demo.dto.LoginDto;
import com.example.demo.dto.LoginResponseDto;
import com.example.demo.dto.StudentRegistrationDto;
import com.example.demo.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register/student")
    public ResponseEntity<String> registerStudent(@Valid @RequestBody StudentRegistrationDto registrationDto) {
        return ResponseEntity.ok(authService.registerStudent(registrationDto));
    }

    @PostMapping("/register/instructor")
    public ResponseEntity<String> registerInstructor(@Valid @RequestBody InstructorRegistrationDto registrationDto) {
        return ResponseEntity.ok(authService.registerInstructor(registrationDto));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@Valid @RequestBody LoginDto loginDto) {
        return ResponseEntity.ok(authService.login(loginDto));
    }
}
