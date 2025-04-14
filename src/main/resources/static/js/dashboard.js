// Handle Dashboard Load
document.addEventListener('DOMContentLoaded', async function () {
    const userId = localStorage.getItem('userId');
    if (!userId) {
        window.location.href = 'index.html'; // Redirect to login if not logged in
        return;
    }

    // Fetch user details to get the name
    try {
        const userResponse = await fetch(`http://localhost:8080/api/users/${userId}`);
        const user = await userResponse.json();
        document.getElementById('userName').textContent = user.firstName;
    } catch (err) {
        console.error('Error fetching user details:', err);
    }

    // Fetch and display accounts
    try {
        const accountsResponse = await fetch(`http://localhost:8080/api/accounts/user/${userId}`);
        const accounts = await accountsResponse.json();
        const accountsList = document.getElementById('accountsList');
        accountsList.innerHTML = '';

        if (accounts.length === 0) {
            accountsList.innerHTML = '<p>No accounts found.</p>';
        } else {
            accounts.forEach(account => {
                const accountDiv = document.createElement('div');
                accountDiv.classList.add('account-item');
                // Convert balance string to number for formatting
                const balance = parseFloat(account.balance);
                accountDiv.innerHTML = `
                    <p>${account.accountType} x${account.accountNumber.slice(-4)}</p>
                    <p>$${balance.toFixed(2)}</p>
                    <p>Available</p>
                `;
                accountsList.appendChild(accountDiv);
            });
        }
    } catch (err) {
        console.error('Error fetching accounts:', err);
    }

    // Fetch and display transactions
    try {
        const transactionsResponse = await fetch(`http://localhost:8080/api/users/${userId}/transactions`);
        const transactions = await transactionsResponse.json();
        const transactionsList = document.getElementById('transactionsList');
        transactionsList.innerHTML = '';

        if (transactions.length === 0) {
            transactionsList.innerHTML = '<p>No transactions found.</p>';
        } else {
            transactions.forEach(transaction => {
                const transactionDiv = document.createElement('div');
                transactionDiv.classList.add('transaction-item');
                // Convert amount string to number for formatting
                const amount = parseFloat(transaction.amount);
                const amountPrefix = transaction.transactionType === 'DEPOSIT' ? '+' : '-';
                transactionDiv.innerHTML = `
                    <p>${transaction.description}</p>
                    <p>${amountPrefix}$${amount.toFixed(2)}</p>
                `;
                transactionsList.appendChild(transactionDiv);
            });
        }
    } catch (err) {
        console.error('Error fetching transactions:', err);
    }
});

// Toggle Forms Section
document.getElementById('toggleFormsBtn')?.addEventListener('click', function () {
    const formsSection = document.getElementById('formsSection');
    formsSection.style.display = formsSection.style.display === 'none' ? 'block' : 'none';
});

document.getElementById('transferNav')?.addEventListener('click', function (event) {
    event.preventDefault();
    const formsSection = document.getElementById('formsSection');
    formsSection.style.display = formsSection.style.display === 'none' ? 'block' : 'none';
});

// Handle Deposit Form Submission
document.getElementById('depositForm')?.addEventListener('submit', async function (event) {
    event.preventDefault();

    const accountNumber = document.getElementById('depositAccountNumber').value;
    const amount = document.getElementById('depositAmount').value;
    const securityPin = document.getElementById('depositSecurityPin').value;
    const depositMessage = document.getElementById('depositMessage');

    try {
        const response = await fetch('http://localhost:8080/api/accounts/deposit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                accountNumber,
                amount,
                securityPin
            })
        });

        const data = await response.json();

        if (response.ok) {
            depositMessage.textContent = 'Deposit successful';
            depositMessage.classList.add('successMessage');
            setTimeout(() => {
                location.reload();
            }, 2000);
        } else {
            alert('Deposit failed: ' + (data.message || 'Unknown error'));
        }
    } catch (err) {
        alert('Error during deposit: ' + err.message);
    }
});

// Handle Withdraw Form Submission
document.getElementById('withdrawForm')?.addEventListener('submit', async function (event) {
    event.preventDefault();

    const accountNumber = document.getElementById('withdrawAccountNumber').value;
    const amount = document.getElementById('withdrawAmount').value;
    const securityPin = document.getElementById('withdrawSecurityPin').value;
    const withdrawMessage = document.getElementById('withdrawMessage');

    try {
        const response = await fetch('http://localhost:8080/api/accounts/withdraw', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                accountNumber,
                amount,
                securityPin
            })
        });

        const data = await response.json();

        if (response.ok) {
            withdrawMessage.textContent = 'Withdrawal successful';
            withdrawMessage.classList.add('successMessage');
            setTimeout(() => {
                location.reload();
            }, 2000);
        } else {
            alert('Withdrawal failed: ' + (data.message || 'Unknown error'));
        }
    } catch (err) {
        alert('Error during withdrawal: ' + err.message);
    }
});

// Handle Transfer Form Submission
document.getElementById('transferForm')?.addEventListener('submit', async function (event) {
    event.preventDefault();

    const fromAccountNumber = document.getElementById('fromAccountNumber').value;
    const toAccountNumber = document.getElementById('toAccountNumber').value;
    const amount = document.getElementById('transferAmount').value;
    const securityPin = document.getElementById('transferSecurityPin').value;
    const transferMessage = document.getElementById('transferMessage');

    try {
        const response = await fetch('http://localhost:8080/api/accounts/transfer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                fromAccountNumber,
                toAccountNumber,
                amount,
                securityPin
            })
        });

        const data = await response.json();

        if (response.ok) {
            transferMessage.textContent = 'Transfer successful';
            transferMessage.classList.add('successMessage');
            setTimeout(() => {
                location.reload();
            }, 2000);
        } else {
            alert('Transfer failed: ' + (data.message || 'Unknown error'));
        }
    } catch (err) {
        alert('Error during transfer: ' + err.message);
    }
});

// Handle Logout
document.getElementById('logoutBtn')?.addEventListener('click', function () {
    localStorage.removeItem('userId');
    window.location.href = 'index.html';
});