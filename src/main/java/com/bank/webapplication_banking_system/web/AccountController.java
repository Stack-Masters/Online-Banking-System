package com.bank.webapplication_banking_system.web;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.bank.webapplication_banking_system.model.Account;
import com.bank.webapplication_banking_system.repository.AccountRepository;
import com.bank.webapplication_banking_system.repository.TransactionRepository;
import com.bank.webapplication_banking_system.service.AccountService;

@Controller
public class AccountController {

    @Autowired
    private AccountService accountService;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @GetMapping("/api/accounts/user/{userId}")
    @ResponseBody
    public ResponseEntity<List<Account>> getUserAccounts(@PathVariable Long userId) {
        List<Account> accounts = accountService.getUserAccounts(userId);
        return ResponseEntity.ok(accounts);
    }

    @GetMapping("/api/users/{userId}/has-main-account")
    @ResponseBody
    public ResponseEntity<Map<String, Boolean>> hasMainAccount(@PathVariable Long userId) {
        List<Account> accounts = accountService.getUserAccounts(userId);
        boolean hasMainAccount = accounts.stream().anyMatch(account -> "CHECKING".equalsIgnoreCase(account.getAccountType()));
        Map<String, Boolean> response = new HashMap<>();
        response.put("hasMainAccount", hasMainAccount);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/api/accounts/create-main")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> createMainAccount(@RequestBody Map<String, Object> accountData) {
        Map<String, Object> response = new HashMap<>();
        try {
            // Extract and validate userId
            if (!accountData.containsKey("userId")) {
                throw new IllegalArgumentException("userId is required");
            }
            Long userId;
            try {
                userId = Long.parseLong(accountData.get("userId").toString());
            } catch (NumberFormatException e) {
                throw new IllegalArgumentException("Invalid userId format");
            }
    
            // Extract and validate securityPin
            if (!accountData.containsKey("securityPin")) {
                throw new IllegalArgumentException("securityPin is required");
            }
            String securityPin = accountData.get("securityPin").toString();
            if (securityPin.trim().isEmpty()) {
                throw new IllegalArgumentException("securityPin cannot be empty");
            }
    
            // Create the main account using AccountService
            Account account = accountService.createAccount(userId, securityPin, "CHECKING");
    
            response.put("success", true);
            response.put("message", "Main Account created successfully");
            response.put("accountNumber", account.getAccountNumber());
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } catch (RuntimeException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Unexpected error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/api/accounts/deposit")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> deposit(
            @RequestParam String accountNumber,
            @RequestParam Double amount,
            @RequestParam String securityPin) {
        Map<String, Object> response = new HashMap<>();
        try {
            accountService.deposit(accountNumber, amount, securityPin);
            response.put("success", true);
            response.put("message", "Deposit successful");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/api/accounts/withdraw")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> withdraw(
            @RequestParam String accountNumber,
            @RequestParam Double amount,
            @RequestParam String securityPin) {
        Map<String, Object> response = new HashMap<>();
        try {
            accountService.withdraw(accountNumber, amount, securityPin);
            response.put("success", true);
            response.put("message", "Withdrawal successful");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/api/accounts/transfer")
    @ResponseBody
    public ResponseEntity<String> transfer(
            @RequestParam String fromAccountNumber,
            @RequestParam String toAccountNumber,
            @RequestParam Double amount,
            @RequestParam String securityPin) {
        try {
            accountService.transfer(fromAccountNumber, toAccountNumber, amount, securityPin);
            return ResponseEntity.ok("Transfer successful");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Transfer failed: " + e.getMessage());
        }
    }


   @PostMapping("/api/accounts/create-sub")
@ResponseBody
public ResponseEntity<Map<String, Object>> createSubAccount(@RequestBody Map<String, Object> accountData) {
    Map<String, Object> response = new HashMap<>();
    try {
        // Extract and validate userId
        if (!accountData.containsKey("userId")) {
            throw new IllegalArgumentException("userId is required");
        }
        Long userId;
        try {
            userId = Long.parseLong(accountData.get("userId").toString());
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Invalid userId format");
        }

        // Extract and validate accountType
        if (!accountData.containsKey("accountType")) {
            throw new IllegalArgumentException("accountType is required");
        }
        String accountType = accountData.get("accountType").toString().toUpperCase();

        // Extract and validate securityPin
        if (!accountData.containsKey("securityPin")) {
            throw new IllegalArgumentException("securityPin is required");
        }
        String securityPin = accountData.get("securityPin").toString();
        if (securityPin.trim().isEmpty()) {
            throw new IllegalArgumentException("securityPin cannot be empty");
        }

        // Create the sub-account using AccountService
        Account account = accountService.createAccount(userId, securityPin, accountType);

        response.put("success", true);
        response.put("message", "Sub-account created successfully");
        response.put("accountNumber", account.getAccountNumber());
        return ResponseEntity.ok(response);
    } catch (IllegalArgumentException e) {
        response.put("success", false);
        response.put("message", e.getMessage());
        return ResponseEntity.badRequest().body(response);
    } catch (RuntimeException e) {
        response.put("success", false);
        response.put("message", e.getMessage());
        return ResponseEntity.badRequest().body(response);
    } catch (Exception e) {
        response.put("success", false);
        response.put("message", "Unexpected error: " + e.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}

}