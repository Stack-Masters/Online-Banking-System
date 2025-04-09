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
            // Show success message
            errorMessage.textContent = data.message; // "Successfully registered"
            errorMessage.classList.add('successMessage');
            // Redirect to login page after 2 seconds
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        } else {
            // Show alert with the reason for failure
            alert(data.message); // e.g., "Email already exists" or "Registration failed: ..."
        }
    } catch (err) {
        alert('Error during registration: ' + err.message);
    }
});