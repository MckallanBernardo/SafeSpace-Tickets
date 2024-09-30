document.addEventListener('DOMContentLoaded', () => {
    const dbName = 'userDB';
    const storeName = 'users';
    const request = indexedDB.open(dbName, 1);

    request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName, { keyPath: 'email' });
        }
    };

    request.onsuccess = (event) => {
        const db = event.target.result;

        document.getElementById('registerForm').addEventListener('submit', (event) => {
            event.preventDefault();

            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            const transaction = db.transaction(storeName, 'readwrite');
            const store = transaction.objectStore(storeName);

            const user = {
                username,
                email,
                password
            };

            const request = store.add(user);

            request.onsuccess = () => {
                document.getElementById('registerMessage').textContent = 'Registration successful!';
                document.getElementById('registerForm').reset();
                setTimeout(() => {
                    window.location.href = 'login.html'; // Redirect to login page after a short delay
                }, 1000); // Delay in milliseconds (1 second)
            };

            request.onerror = (event) => {
                document.getElementById('registerMessage').textContent = 'Registration failed!';
            };
        });
    };

    request.onerror = (event) => {
        console.error('Database error:', event.target.errorCode);
    };
});
