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

        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);

        // Clear all records from the store
        const clearRequest = store.clear();

        clearRequest.onsuccess = () => {
            console.log('All user data cleared successfully.');
        };

        clearRequest.onerror = (event) => {
            console.error('Error clearing user data:', event.target.errorCode);
        };
    };

    request.onerror = (event) => {
        console.error('Database error:', event.target.errorCode);
    };
});
