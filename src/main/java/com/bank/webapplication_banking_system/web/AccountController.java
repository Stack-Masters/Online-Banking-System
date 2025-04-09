package com.bank.webapplication_banking_system.web;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.bank.webapplication_banking_system.model.Account;
import com.bank.webapplication_banking_system.service.AccountService;

@Controller
@RequestMapping("/api/accounts")
public class AccountController {

    @Autowired
    private AccountService accountService;

    @GetMapping("/user/{userId}")
    @ResponseBody
    public ResponseEntity<List<Account>> getUserAccounts(@PathVariable Long userId) {
        List<Account> accounts = accountService.getUserAccounts(userId);
        return ResponseEntity.ok(accounts);
    }

    @PostMapping("/create")
    @ResponseBody
    public ResponseEntity<Account> createAccount(
            @RequestParam Long userId,
            @RequestParam String securityPin,
            @RequestParam String accountType) {
        try {
            Account account = accountService.createAccount(userId, securityPin, accountType);
            return ResponseEntity.ok(account);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PostMapping("/deposit")
    @ResponseBody
    public ResponseEntity<Account> deposit(
            @RequestParam String accountNumber,
            @RequestParam BigDecimal amount,
            @RequestParam String securityPin) {
        try {
            Account updatedAccount = accountService.deposit(accountNumber, amount.doubleValue(), securityPin);
            return ResponseEntity.ok(updatedAccount);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null); // Return null instead of e.getMessage()
        }
    }

    @PostMapping("/withdraw")
    @ResponseBody
    public ResponseEntity<Account> withdraw(
            @RequestParam String accountNumber,
            @RequestParam BigDecimal amount,
            @RequestParam String securityPin) {
        try {
            Account updatedAccount = accountService.withdraw(accountNumber, amount.doubleValue(), securityPin);
            return ResponseEntity.ok(updatedAccount);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null); // Return null instead of e.getMessage()
        }
    }

    @PostMapping("/transfer")
    @ResponseBody
    public ResponseEntity<String> transfer(
            @RequestParam String fromAccountNumber,
            @RequestParam String toAccountNumber,
            @RequestParam BigDecimal amount,
            @RequestParam String securityPin) {
        try {
            accountService.transfer(fromAccountNumber, toAccountNumber, amount.doubleValue(), securityPin);
            return ResponseEntity.ok("Transfer successful");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}