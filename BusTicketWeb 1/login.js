document.addEventListener('DOMContentLoaded', () => {
    const dbName = 'userDB';
    const storeName = 'users';
    const request = indexedDB.open(dbName, 1);

    request.onsuccess = (event) => {
        const db = event.target.result;

        document.getElementById('loginForm').addEventListener('submit', (event) => {
            event.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            const transaction = db.transaction(storeName, 'readonly');
            const store = transaction.objectStore(storeName);

            const request = store.get(email);

            request.onsuccess = () => {
                const user = request.result;
                if (user && user.password === password) {
                    window.location.href = 'home.html';
                } else {
                    document.getElementById('loginMessage').textContent = 'Invalid email or password!';
                }
            };

            request.onerror = () => {
                document.getElementById('loginMessage').textContent = 'Login failed!';
            };
        });
    };

    request.onerror = (event) => {
        console.error('Database error:', event.target.errorCode);
    };
});
