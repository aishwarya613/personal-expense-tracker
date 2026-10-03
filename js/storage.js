const STORAGE_KEY = "transactions";


function saveTransactions(transactions) {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(transactions)
    );

}


function loadTransactions() {

    const data = localStorage.getItem(STORAGE_KEY);

    if (data === null) {
        return [];
    }

    return JSON.parse(data);

}