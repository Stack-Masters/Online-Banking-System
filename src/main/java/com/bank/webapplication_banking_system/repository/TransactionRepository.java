package com.bank.webapplication_banking_system.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bank.webapplication_banking_system.model.Transaction;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByUserId(Long userId);
}