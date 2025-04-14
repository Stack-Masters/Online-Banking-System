// Handle Dashboard Load
document.addEventListener('DOMContentLoaded', async function () {
    const userId = localStorage.getItem('userId');
    if (!userId) {
        window.location.href = 'index.html'; // Redirect to login if not logged in
        return;
    }

    // Fetch user details to get the name
    let userName = 'User';
    let userTitle = 'MR'; // Mocked; replace with API data if available
    try {
        const userResponse = await fetch(`http://localhost:8080/api/users/${userId}`);
        const user = await userResponse.json();
        userName = user.firstName;
        document.getElementById('userName').textContent = userName;
        userTitle = user.title || 'MR'; // Use title if provided by API
    } catch (err) {
        console.error('Error fetching user details:', err);
    }

    // Fetch and display accounts
    try {
        const accountsResponse = await fetch(`http://localhost:8080/api/accounts/user/${userId}`);
        const accounts = await accountsResponse.json();
        const accountsList = document.getElementById('accountsList');
        const cardsList = document.getElementById('cardsList');
        accountsList.innerHTML = '';
        cardsList.innerHTML = '';

        // Populate Account Overview
        const overviewBalance = document.getElementById('overviewBalance');
        const overviewAccountNumber = document.getElementById('overviewAccountNumber');
        const overviewAccountType = document.getElementById('overviewAccountType');
        const viewAllAccountsBtn = document.getElementById('viewAllAccountsBtn');

        if (accounts.length === 0) {
            accountsList.innerHTML = '<p>No accounts found.</p>';
            cardsList.innerHTML = '<p>No cards found.</p>';
            overviewBalance.textContent = '$0.00';
            overviewAccountNumber.textContent = 'N/A';
            overviewAccountType.textContent = 'N/A';
            viewAllAccountsBtn.style.display = 'none';
        } else {
            // Display accounts in the accounts list
            accounts.forEach(account => {
                const accountDiv = document.createElement('div');
                accountDiv.classList.add('account-item');
                const balance = parseFloat(account.balance);
                accountDiv.innerHTML = `
                    <p>${account.accountType} x${account.accountNumber.slice(-4)}</p>
                    <p>$${balance.toFixed(2)}</p>
                    <p>Available</p>
                `;
                accountsList.appendChild(accountDiv);
            });

            // Populate Cards section
            accounts.forEach(account => {
                const cardDiv = document.createElement('div');
                cardDiv.classList.add('card-item');
                const expiryDate = generateExpiryDate();
                const cardNumber = formatAccountNumber(account.accountNumber);
                const cardType = 'VISA'; // Mocked; replace with API data if available
                const cardholderName = `${userTitle} ${userName.toUpperCase()}`; // Use last name if available

                cardDiv.innerHTML = `
                    <div class="card-content">
                        <div class="card-header">
                            <span class="account-type">${account.accountType.toUpperCase()}</span>
                            <span class="bank-name">Masters Bank</span>
                        </div>
                        <div class="card-body">
                            <img src="https://i.postimg.cc/P5cFc3yj/Chip.jpg" class="chip" alt="Chip" />
                            <span class="card-type">${cardType}</span>
                            <div class="card-number">${cardNumber}</div>
                            <div class="card-details">
                                <span class="valid-thru">Valid Thru ${expiryDate}</span>
                            </div>
                            <div class="cardholder">${cardholderName}</div>
                        </div>
                    </div>
                `;
                cardsList.appendChild(cardDiv);
            });

            // Populate Account Overview with the first account
            const firstAccount = accounts[0];
            const balance = parseFloat(firstAccount.balance);
            overviewBalance.textContent = `$${balance.toFixed(2)}`;
            const maskedAccountNumber = '**** **** **** ' + firstAccount.accountNumber.slice(-4);
            overviewAccountNumber.textContent = maskedAccountNumber;
            overviewAccountType.textContent = firstAccount.accountType;

            if (accounts.length > 1) {
                viewAllAccountsBtn.style.display = 'block';
                viewAllAccountsBtn.addEventListener('click', function () {
                    console.log('View All Accounts clicked');
                });
            } else {
                viewAllAccountsBtn.style.display = 'none';
            }
        }
    } catch (err) {
        console.error('Error fetching accounts:', err);
        document.getElementById('cardsList').innerHTML = '<p>Error loading cards.</p>';
    }

    // Function to fetch and display transactions
    async function loadTransactions() {
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
            document.getElementById('transactionsList').innerHTML = '<p>Error loading transactions.</p>';
        }
    }

    // Function to toggle sections
    function toggleSection(sectionId) {
        const withdrawSection = document.getElementById('withdrawSection');
        const depositSection = document.getElementById('depositSection');
        const transferSection = document.getElementById('transferSection');
        const transactionsSection = document.getElementById('transactionsSection');
        const cardsSection = document.getElementById('cardsSection');
        const accountOverviewSection = document.getElementById('accountOverviewSection');
        const accountsSection = document.getElementById('accountsSection');
        const transferButtonSection = document.getElementById('transferButtonSection');

        // Hide all sections by default
        withdrawSection.style.display = 'none';
        depositSection.style.display = 'none';
        transferSection.style.display = 'none';
        transactionsSection.style.display = 'none';
        cardsSection.style.display = 'none';
        accountOverviewSection.style.display = 'none';
        accountsSection.style.display = 'none';
        transferButtonSection.style.display = 'none';

        // Show the selected section
        if (sectionId === 'withdrawSection') {
            withdrawSection.style.display = 'block';
        } else if (sectionId === 'depositSection') {
            depositSection.style.display = 'block';
        } else if (sectionId === 'transferSection') {
            transferSection.style.display = 'block';
        } else if (sectionId === 'transactionsSection') {
            transactionsSection.style.display = 'block';
            loadTransactions();
        } else if (sectionId === 'cardsSection') {
            cardsSection.style.display = 'block';
        } else if (sectionId === 'dashboard') {
            accountOverviewSection.style.display = 'block';
            accountsSection.style.display = 'block';
            transferButtonSection.style.display = 'block';
        }

        // Update active navigation item
        document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
            item.classList.remove('active');
        });
        const activeNav = sectionId === 'dashboard' ? 'dashboardNav' : `${sectionId.replace('Section', '')}Nav`;
        document.getElementById(activeNav)?.classList.add('active');
    }

    // Show dashboard by default on page load
    toggleSection('dashboard');

    // Toggle Dashboard
    document.getElementById('dashboardNav')?.addEventListener('click', function (event) {
        event.preventDefault();
        toggleSection('dashboard');
    });

    // Toggle Withdraw Section
    document.getElementById('withdrawalsNav')?.addEventListener('click', function (event) {
        event.preventDefault();
        toggleSection('withdrawSection');
    });

    // Toggle Deposit Section
    document.getElementById('depositNav')?.addEventListener('click', function (event) {
        event.preventDefault();
        toggleSection('depositSection');
    });

    // Toggle Transfer Section
    document.getElementById('transferNav')?.addEventListener('click', function (event) {
        event.preventDefault();
        toggleSection('transferSection');
    });

    document.getElementById('toggleTransferBtn')?.addEventListener('click', function () {
        toggleSection('transferSection');
    });

    // Toggle Transactions Section
    document.getElementById('transactionsNav')?.addEventListener('click', function (event) {
        event.preventDefault();
        toggleSection('transactionsSection');
    });

    // Toggle Cards Section
    document.getElementById('cardsNav')?.addEventListener('click', function (event) {
        event.preventDefault();
        toggleSection('cardsSection');
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

    // Helper functions
    function formatAccountNumber(number) {
        return number.replace(/(\d{4})(?=\d)/g, '$1 ');
    }

    function generateExpiryDate() {
        const date = new Date();
        const year = date.getFullYear() + 5;
        const month = String(date.getMonth() + 1).padStart(2, '0');
        return `${month}/${year.toString().slice(-2)}`;
    }
});