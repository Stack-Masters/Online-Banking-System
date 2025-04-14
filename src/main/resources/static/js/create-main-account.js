// Handle Create Main Account Form Submission
document.getElementById('createMainAccountForm')?.addEventListener('submit', async function (event) {
    event.preventDefault();

    const userId = localStorage.getItem('userId');
    if (!userId) {
        window.location.href = 'index.html'; // Redirect to login if not logged in
        return;
    }

    const accountType = document.getElementById('accountType').value;
    const securityPin = document.getElementById('securityPin').value;
    const errorMessage = document.getElementById('errorMessage');

    try {
        const response = await fetch('http://localhost:8080/api/accounts/create-main', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId, accountType, securityPin })
        });

        const data = await response.json();

        if (response.ok) {
            errorMessage.textContent = 'Main Account created successfully';
            errorMessage.classList.add('successMessage');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 2000);
        } else {
            errorMessage.textContent = 'Failed to create Main Account: ' + (data.message || 'Unknown error');
            errorMessage.classList.remove('successMessage');
            errorMessage.classList.add('errorMessage');
        }
    } catch (err) {
        errorMessage.textContent = 'Error during account creation: ' + err.message;
        errorMessage.classList.remove('successMessage');
        errorMessage.classList.add('errorMessage');
    }
});