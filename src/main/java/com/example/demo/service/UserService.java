package com.example.demo.service;

import com.example.demo.model.ActivityLog;
import com.example.demo.model.User;
import com.example.demo.repository.ActivityLogRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ActivityLogRepository activityLogRepository;

    public User registerUser(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists!");
        }
        User savedUser = userRepository.save(user);

        logActivity(savedUser.getId(), savedUser.getUsername(), "REGISTER");

        return savedUser;
    }

    public User loginUser(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isPresent() && userOpt.get().getPassword().equals(password)) {
            User user = userOpt.get();
            logActivity(user.getId(), user.getUsername(), "LOGIN");
            return user;
        }

        throw new RuntimeException("Invalid credentials!");
    }

    private void logActivity(Long userId, String username, String action) {
        ActivityLog log = new ActivityLog();
        log.setUserId(userId);
        log.setUsername(username);
        log.setAction(action);
        log.setTimestamp(LocalDateTime.now());
        activityLogRepository.save(log);
    }
}
