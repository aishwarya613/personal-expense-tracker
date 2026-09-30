const formError = document.getElementById("form-error");
const balanceElement = document.getElementById("balance");
const totalIncomeElement = document.getElementById("total-income");
const totalExpensesElement = document.getElementById("total-expenses");
const transactionsList = document.getElementById("transactions-list");
console.log("Expense Tracker is running!");

const transactionForm = document.getElementById("transaction-form");

const titleInput = document.getElementById("title");
const amountInput = document.getElementById("amount");
amountInput.addEventListener("wheel", function(event) {
    event.preventDefault();
});
const typeInput = document.getElementById("type");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");
const descriptionInput = document.getElementById("description");

let transactions = [];
let editingTransactionId = null;
function calculateTotals() {
    let totalIncome = 0;
    let totalExpenses = 0;

    for (const transaction of transactions) {
        if (transaction.type === "income") {
            totalIncome += transaction.amount;
        }

        if (transaction.type === "expense") {
            totalExpenses += transaction.amount;
        }
    }

    const balance = totalIncome - totalExpenses;

    console.log("Total Income:", totalIncome);
    console.log("Total Expenses:", totalExpenses);
    console.log("Balance:", balance);
    balanceElement.textContent = `₹${balance.toFixed(2)}`;
totalIncomeElement.textContent = `₹${totalIncome.toFixed(2)}`;
totalExpensesElement.textContent = `₹${totalExpenses.toFixed(2)}`;
}

function renderTransactions() {
    transactionsList.innerHTML = "";

    for (const transaction of transactions) {
        const transactionElement = document.createElement("div");

        transactionElement.classList.add("transaction-item");

        transactionElement.innerHTML = `
            <div>
                <h3>${transaction.title}</h3>
                <p>${transaction.category} • ${transaction.date}</p>
                <p>${transaction.description}</p>
            </div>

            <div>
    <strong>₹${transaction.amount.toFixed(2)}</strong>
    <button class="edit-btn" data-id="${transaction.id}">
    Edit
</button>

<button class="delete-btn" data-id="${transaction.id}">
    Delete
</button>
</div>
        `;

        transactionsList.appendChild(transactionElement);
    }
    const deleteButtons = document.querySelectorAll(".delete-btn");
    const editButtons = document.querySelectorAll(".edit-btn");

deleteButtons.forEach(function(button) {
    button.addEventListener("click", function() {
        const id = Number(button.dataset.id);
transactions = transactions.filter(function(transaction) {
    return transaction.id !== id;
});
calculateTotals();
        renderTransactions();
    });
});
editButtons.forEach(function(button) {
    button.addEventListener("click", function() {
        const id = Number(button.dataset.id);
        editingTransactionId = id;
        const transaction = transactions.find(function(transaction) {
    return transaction.id === id;
});

console.log("Transaction found:", transaction);
console.log("Clicked ID:", id);
titleInput.value = transaction.title;
amountInput.value = transaction.amount;
typeInput.value = transaction.type;
categoryInput.value = transaction.category;
dateInput.value = transaction.date;
descriptionInput.value = transaction.description;
    });
});
}

transactionForm.addEventListener("submit", function(event) {
    event.preventDefault();
    formError.textContent = "";
    console.log("Amount entered:", amountInput.value);
console.log("Amount as number:", Number(amountInput.value));

if (titleInput.value.trim() === "") {
    formError.textContent = "Please enter a title.";
    return;
}

if (Number(amountInput.value) <= 0) {
    formError.textContent = "Amount must be greater than 0.";
    return;
}

if (typeInput.value === "") {
    formError.textContent = "Please select a transaction type.";
    return;
}

if (categoryInput.value === "") {
    formError.textContent = "Please select a category.";
    return;
}

if (dateInput.value === "") {
    formError.textContent = "Please select a date.";
    return;
}
    const transaction = {
        id: editingTransactionId !== null
        ? editingTransactionId
        : Date.now(),
        title: titleInput.value,
        amount: Number(amountInput.value),
        type: typeInput.value,
        category: categoryInput.value,
        date: dateInput.value,
        description: descriptionInput.value
    };

    if (editingTransactionId === null) {
    transactions.push(transaction);
} else {
    const index = transactions.findIndex(function(transaction) {
        return transaction.id === editingTransactionId;
    });

    transactions[index] = transaction;

    editingTransactionId = null;
}
    
    console.log(transactions);
    
    calculateTotals();

    renderTransactions();
});