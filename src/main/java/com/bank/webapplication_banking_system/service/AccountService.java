package com.bank.webapplication_banking_system.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bank.webapplication_banking_system.model.Account;
import com.bank.webapplication_banking_system.model.Transaction;
import com.bank.webapplication_banking_system.repository.AccountRepository;
import com.bank.webapplication_banking_system.repository.TransactionRepository;
import com.bank.webapplication_banking_system.repository.UserRepository;

@Service
public class AccountService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    public Account createAccount(Long userId, String securityPin, String accountType) {
        // Verify the user exists
        userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Get the user's existing accounts
        List<Account> userAccounts = accountRepository.findByUserId(userId);

        // Check account limits
        long mainAccountCount = userAccounts.stream()
                .filter(account -> account.getAccountType().equals("MAIN"))
                .count();
        long subAccountCount = userAccounts.stream()
                .filter(account -> account.getAccountType().equals("SUB"))
                .count();

        // If this is the first account, it must be a Main account
        if (userAccounts.isEmpty()) {
            if (!accountType.equals("MAIN")) {
                throw new RuntimeException("The first account must be a Main account");
            }
        } else {
            // Enforce limits: 1 Main account, 3 Sub accounts
            if (accountType.equals("MAIN") && mainAccountCount >= 1) {
                throw new RuntimeException("User already has a Main account");
            }
            if (accountType.equals("SUB") && subAccountCount >= 3) {
                throw new RuntimeException("User has reached the limit of 3 Sub accounts");
            }
        }

        // Create the account
        String accountNumber = "ACC" + new Random().nextInt(1000000);
        Account account = new Account();
        account.setUserId(userId);
        account.setAccountNumber(accountNumber);
        account.setAccountType(accountType);
        account.setBalance(BigDecimal.ZERO);
        account.setSecurityPin(securityPin);
        Account savedAccount = accountRepository.save(account);

        // Record a transaction for account creation
        Transaction transaction = new Transaction();
        transaction.setUserId(userId);
        transaction.setAccountNumber(accountNumber);
        transaction.setAmount(BigDecimal.ZERO);
        transaction.setTransactionType("ACCOUNT_CREATION");
        transaction.setDescription("New " + accountType + " account created: " + accountNumber);
        transaction.setTransactionDate(LocalDateTime.now());
        transactionRepository.save(transaction);

        return savedAccount;
    }

    public List<Account> getUserAccounts(Long userId) {
        return accountRepository.findByUserId(userId);
    }

    public List<Transaction> getUserTransactions(Long userId) {
        return transactionRepository.findByUserId(userId);
    }

    public Account getAccountByAccountNumber(String accountNumber) {
        return accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new RuntimeException("Account not found"));
    }

    @Transactional
    public Account deposit(String accountNumber, Double amount, String securityPin) {
        if (amount <= 0) {
            throw new IllegalArgumentException("Deposit amount must be positive");
        }
        Account account = getAccountByAccountNumber(accountNumber);
        if (!account.getSecurityPin().equals(securityPin)) {
            throw new RuntimeException("Invalid security pin");
        }
        account.setBalance(account.getBalance().add(BigDecimal.valueOf(amount)));
        Account updatedAccount = accountRepository.save(account);

        // Record the transaction
        Transaction transaction = new Transaction();
        transaction.setUserId(account.getUserId());
        transaction.setAccountNumber(accountNumber);
        transaction.setAmount(BigDecimal.valueOf(amount));
        transaction.setTransactionType("DEPOSIT");
        transaction.setDescription("Deposit to account " + accountNumber);
        transaction.setTransactionDate(LocalDateTime.now());
        transactionRepository.save(transaction);

        return updatedAccount;
    }

    @Transactional
    public Account withdraw(String accountNumber, Double amount, String securityPin) {
        if (amount <= 0) {
            throw new IllegalArgumentException("Withdrawal amount must be positive");
        }
        Account account = getAccountByAccountNumber(accountNumber);
        if (!account.getSecurityPin().equals(securityPin)) {
            throw new RuntimeException("Invalid security pin");
        }
        if (account.getBalance().compareTo(BigDecimal.valueOf(amount)) < 0) {
            throw new RuntimeException("Insufficient funds");
        }
        account.setBalance(account.getBalance().subtract(BigDecimal.valueOf(amount)));
        Account updatedAccount = accountRepository.save(account);

        // Record the transaction
        Transaction transaction = new Transaction();
        transaction.setUserId(account.getUserId());
        transaction.setAccountNumber(accountNumber);
        transaction.setAmount(BigDecimal.valueOf(amount));
        transaction.setTransactionType("WITHDRAWAL");
        transaction.setDescription("Withdrawal from account " + accountNumber);
        transaction.setTransactionDate(LocalDateTime.now());
        transactionRepository.save(transaction);

        return updatedAccount;
    }

    @Transactional
    public void transfer(String fromAccountNumber, String toAccountNumber, Double amount, String securityPin) {
        Account fromAccount = withdraw(fromAccountNumber, amount, securityPin);
        Account toAccount = getAccountByAccountNumber(toAccountNumber);
        toAccount.setBalance(toAccount.getBalance().add(BigDecimal.valueOf(amount)));
        accountRepository.save(toAccount);

        // Record the transfer transaction
        Transaction transaction = new Transaction();
        transaction.setUserId(fromAccount.getUserId());
        transaction.setAccountNumber(fromAccountNumber);
        transaction.setAmount(BigDecimal.valueOf(amount));
        transaction.setTransactionType("TRANSFER");
        transaction.setDescription("Transfer from account " + fromAccountNumber + " to account " + toAccountNumber);
        transaction.setTransactionDate(LocalDateTime.now());
        transactionRepository.save(transaction);
    }
}