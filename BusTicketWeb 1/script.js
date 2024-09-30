document.addEventListener('DOMContentLoaded', () => {
    let db;

    const request = indexedDB.open('busTicketsDB', 1);

    request.onupgradeneeded = function(e) {
        db = e.target.result;
        db.createObjectStore('tickets', { keyPath: 'id', autoIncrement: true });
    };

    request.onsuccess = function(e) {
        db = e.target.result;
        displayTickets();
    };

    request.onerror = function(e) {
        console.error('IndexedDB error:', e);
    };

    const form = document.getElementById('ticketForm');
    form.addEventListener('submit', addTicket);

    const searchBtn = document.getElementById('searchBtn');
    searchBtn.addEventListener('click', searchTickets);

    const continueButton = document.getElementById('continueButton');
    continueButton.addEventListener('click', () => {
        window.location.href = 'thankYou.html'; // Redirects to the thank you page
    });

    function addTicket(e) {
        e.preventDefault();
        const transaction = db.transaction(['tickets'], 'readwrite');
        const store = transaction.objectStore('tickets');

        const quantity = parseInt(document.getElementById('quantity').value, 10);
        for (let i = 0; i < quantity; i++) {
            const ticket = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                destination: document.getElementById('destination').value,
                pickup: document.getElementById('pickup').value, // Get pickup point
                date: document.getElementById('date').value
            };

            store.add(ticket);
        }

        transaction.oncomplete = () => {
            displayTickets();
            form.reset(); // Reset the form after submission
            continueButton.style.display = 'block'; // Show continue button
        };

        transaction.onerror = function(e) {
            console.error('Transaction error:', e);
        };
    }

    function displayTickets(filter = null) {
        const transaction = db.transaction(['tickets'], 'readonly');
        const store = transaction.objectStore('tickets');

        const ticketList = document.getElementById('ticketList');
        ticketList.innerHTML = '';

        store.openCursor().onsuccess = function(e) {
            const cursor = e.target.result;
            if(cursor) {
                if (!filter || cursor.value.name.toLowerCase().includes(filter.toLowerCase()) || cursor.value.email.toLowerCase().includes(filter.toLowerCase())) {
                    const li = document.createElement('li');
                    li.textContent = `Name: ${cursor.value.name}, Email: ${cursor.value.email}, Destination: ${cursor.value.destination}, Pickup: ${cursor.value.pickup}, Date: ${cursor.value.date}`;
                    
                    const deleteBtn = document.createElement('button');
                    deleteBtn.textContent = 'Delete';
                    deleteBtn.classList.add('delete'); // Apply the red button style
                    deleteBtn.addEventListener('click', () => deleteTicket(cursor.value.id));
                    li.appendChild(deleteBtn);
                    
                    ticketList.appendChild(li);
                }
                cursor.continue();
            } else {
                if (ticketList.children.length === 0) {
                    const noTicketsMessage = document.createElement('li');
                    noTicketsMessage.textContent = 'No tickets found.';
                    ticketList.appendChild(noTicketsMessage);
                }
            }
        };
    }

    function searchTickets() {
        const searchQuery = document.getElementById('search').value.trim();
        displayTickets(searchQuery);
    }

    function deleteTicket(id) {
        const transaction = db.transaction(['tickets'], 'readwrite');
        const store = transaction.objectStore('tickets');
        store.delete(id);
        transaction.oncomplete = () => {
            displayTickets();
        };
        transaction.onerror = function(e) {
            console.error('Transaction error:', e);
        };
    }
});
