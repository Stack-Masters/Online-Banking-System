package com.bank.webapplication_banking_system.web;

import com.bank.webapplication_banking_system.model.Transaction;
import com.bank.webapplication_banking_system.model.User;
import com.bank.webapplication_banking_system.repository.UserRepository;
import com.bank.webapplication_banking_system.service.AccountService;
import com.bank.webapplication_banking_system.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Controller
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AccountService accountService;

    @PostMapping("/api/register")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> registerUser(
            @RequestBody Map<String, String> userData) {
        Map<String, Object> response = new HashMap<>();
        try {
            String firstName = userData.get("firstName");
            String lastName = userData.get("lastName");
            String email = userData.get("email");
            String password = userData.get("password");

            if (userRepository.findByEmail(email).isPresent()) {
                response.put("success", false);
                response.put("message", "Email already exists");
                return ResponseEntity.badRequest().body(response);
            }

            User user = userService.registerUser(firstName, lastName, email, password);
            response.put("success", true);
            response.put("message", "Successfully registered");
            response.put("user", user);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Registration failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/api/login")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> loginUser(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        Optional<User> userOptional = userRepository.findByEmail(email);
        Map<String, Object> response = new HashMap<>();

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (user.getEmail().equalsIgnoreCase(email) && user.getPassword().equals(password)) {
                response.put("valid", true);
                response.put("userId", user.getId());
                response.put("message", "Login successful");
            } else {
                response.put("valid", false);
                response.put("message", "Invalid email or password");
            }
        } else {
            response.put("valid", false);
            response.put("message", "User not found");
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping("/api/users/{userId}")
    @ResponseBody
    public ResponseEntity<User> getUserById(@PathVariable Long userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            return ResponseEntity.ok(userOptional.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/api/users/{userId}/transactions")
    @ResponseBody
    public ResponseEntity<List<Transaction>> getUserTransactions(@PathVariable Long userId) {
        List<Transaction> transactions = accountService.getUserTransactions(userId);
        return ResponseEntity.ok(transactions);
    }
}