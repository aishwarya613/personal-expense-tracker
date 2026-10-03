const STORAGE_KEY = "transactions";


// Save transactions to localStorage
function saveTransactions(transactions) {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(transactions)
    );
}


// Load transactions from localStorage
function loadTransactions() {

    const data = localStorage.getItem(STORAGE_KEY);

    if (data === null) {
        return [];
    }

    return JSON.parse(data);
}