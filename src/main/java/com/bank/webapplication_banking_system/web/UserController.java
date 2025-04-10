package com.bank.webapplication_banking_system.web;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional; // Add this import

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import com.bank.webapplication_banking_system.model.Transaction;
import com.bank.webapplication_banking_system.model.User;
import com.bank.webapplication_banking_system.repository.UserRepository;
import com.bank.webapplication_banking_system.service.AccountService;
import com.bank.webapplication_banking_system.service.UserService;

@Controller
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AccountService accountService; // Add this to use AccountService

    @PostMapping("/api/register")
    @ResponseBody
    public ResponseEntity<User> registerUser(
            @RequestBody Map<String, String> userData) {
        String firstName = userData.get("firstName");
        String lastName = userData.get("lastName");
        String email = userData.get("email");
        String password = userData.get("password");
        User user = userService.registerUser(firstName, lastName, email, password);
        return ResponseEntity.ok(user);
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
            } else {
                response.put("valid", false);
            }
        } else {
            response.put("valid", false);
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping("/api/users/{userId}/transactions")
    @ResponseBody
    public ResponseEntity<List<Transaction>> getUserTransactions(@PathVariable Long userId) {
        List<Transaction> transactions = accountService.getUserTransactions(userId); // Use AccountService
        return ResponseEntity.ok(transactions);
    }
}