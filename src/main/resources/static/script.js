// Handle Login Form Submission
document.getElementById('loginForm')?.addEventListener('submit', async function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');

    console.log('Login attempt with email:', email); // Debug: Log the email

    try {
        const response = await fetch('http://localhost:8080/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        console.log('Response status:', response.status); // Debug: Log the response status
        const data = await response.json();
        console.log('Response data:', data); // Debug: Log the response data

        if (data.valid) {
            localStorage.setItem('userId', data.userId);
            console.log('Login successful, redirecting to dashboard...'); // Debug
            window.location.href = 'dashboard.html';
        } else {
            errorMessage.textContent = 'Invalid email or password';
            errorMessage.classList.add('showMessage');
            console.log('Login failed: Invalid email or password'); // Debug
        }
    } catch (err) {
        errorMessage.textContent = 'Error during login: ' + err.message;
        errorMessage.classList.add('showMessage');
        console.log('Error during login:', err); // Debug
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

// Handle Logout
document.getElementById('logoutBtn')?.addEventListener('click', function () {
    localStorage.removeItem('userId');
    window.location.href = 'index.html';
});