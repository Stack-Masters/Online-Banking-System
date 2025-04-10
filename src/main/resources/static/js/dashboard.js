// Handle Dashboard Load
document.addEventListener('DOMContentLoaded', async function () {
    const userId = localStorage.getItem('userId');
    if (!userId) {
        window.location.href = 'index.html'; // Redirect to login if not logged in
        return;
    }

    // Fetch and display user details (for greeting)
    try {
        const userResponse = await fetch(`http://localhost:8080/api/users/${userId}`);
        const user = await userResponse.json();
        if (userResponse.ok) {
            document.getElementById('userGreeting').textContent = `Hi, ${user.firstName}`;
        } else {
            document.getElementById('userGreeting').textContent = 'Hi, User';
        }
    } catch (err) {
        console.error('Error fetching user details:', err);
        document.getElementById('userGreeting').textContent = 'Hi, User';
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
                accountDiv.classList.add('account');
                accountDiv.innerHTML = `
                    <div class="account-name">${account.accountType}</div>
                    <div class="account-number">x${account.accountNumber.slice(-4)}</div>
                `;
                accountsList.appendChild(accountDiv);
            });
        }
    } catch (err) {
        console.error('Error fetching accounts:', err);
        document.getElementById('accountsList').innerHTML = '<p>Error loading accounts.</p>';
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
                transactionDiv.classList.add('transaction');
                transactionDiv.innerHTML = `
                    <div class="transaction-title">${transaction.transactionType} - ${transaction.description}</div>
                    <div class="transaction-details">${new Date(transaction.transactionDate).toLocaleDateString()}, ${transaction.accountNumber}</div>
                `;
                transactionsList.appendChild(transactionDiv);
            });
        }
    } catch (err) {
        console.error('Error fetching transactions:', err);
        document.getElementById('transactionsList').innerHTML = '<p>Error loading transactions.</p>';
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

// Handle Logout
document.getElementById('logoutBtn')?.addEventListener('click', function () {
    localStorage.removeItem('userId');
    window.location.href = 'index.html';
});