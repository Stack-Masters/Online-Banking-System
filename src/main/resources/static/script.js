// Handle Login Form Submission
document.getElementById('loginForm')?.addEventListener('submit', async function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');

    try {
        const response = await fetch('http://localhost:8080/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (data.valid) {
            localStorage.setItem('userId', data.userId);
            errorMessage.textContent = data.message;
            errorMessage.classList.add('successMessage');

            // Check if the user has a Main Account
            const hasMainAccountResponse = await fetch(`http://localhost:8080/api/users/${data.userId}/has-main-account`);
            const hasMainAccountData = await hasMainAccountResponse.json();

            setTimeout(() => {
                if (hasMainAccountData.hasMainAccount) {
                    window.location.href = 'dashboard.html';
                } else {
                    window.location.href = 'create-main-account.html';
                }
            }, 2000);
        } else {
            alert(data.message);
        }
    } catch (err) {
        alert('Error during login: ' + err.message);
    }
});

// Handle Register Form Submission
document.getElementById('registerForm')?.addEventListener('submit', async function (event) {
    event.preventDefault();

    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');

    try {
        const response = await fetch('http://localhost:8080/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ firstName, lastName, email, password })
        });

        const data = await response.json();

        if (data.success) {
            errorMessage.textContent = data.message;
            errorMessage.classList.add('successMessage');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        } else {
            alert(data.message);
        }
    } catch (err) {
        alert('Error during registration: ' + err.message);
    }
});