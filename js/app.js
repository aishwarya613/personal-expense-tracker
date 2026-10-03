// =====================================================
// DOM ELEMENTS
// =====================================================

const formError = document.getElementById("form-error");

const balanceElement =
    document.getElementById("balance");

const totalIncomeElement =
    document.getElementById("total-income");

const totalExpensesElement =
    document.getElementById("total-expenses");

const transactionsList =
    document.getElementById("transactions-list");

const transactionForm =
    document.getElementById("transaction-form");

const titleInput =
    document.getElementById("title");

const amountInput =
    document.getElementById("amount");

const typeInput =
    document.getElementById("type");

const categoryInput =
    document.getElementById("category");

const dateInput =
    document.getElementById("date");

const descriptionInput =
    document.getElementById("description");


// Search and filters

const searchInput =
    document.getElementById("search");

const typeFilter =
    document.getElementById("type-filter");

const categoryFilter =
    document.getElementById("category-filter");


console.log("Expense Tracker is running!");


// =====================================================
// PREVENT MOUSE WHEEL FROM CHANGING AMOUNT
// =====================================================

amountInput.addEventListener("wheel", function(event) {

    event.preventDefault();

});


// =====================================================
// APPLICATION STATE
// =====================================================

let transactions = loadTransactions();

let editingTransactionId = null;


// =====================================================
// CALCULATE TOTALS
// =====================================================

function calculateTotals() {

    let totalIncome = 0;

    let totalExpenses = 0;


    transactions.forEach(function(transaction) {

        if (transaction.type === "income") {

            totalIncome += Number(transaction.amount);

        }

        else if (transaction.type === "expense") {

            totalExpenses += Number(transaction.amount);

        }

    });


    const balance =
        totalIncome - totalExpenses;


    totalIncomeElement.textContent =
        `₹${totalIncome.toFixed(2)}`;

    totalExpensesElement.textContent =
        `₹${totalExpenses.toFixed(2)}`;

    balanceElement.textContent =
        `₹${balance.toFixed(2)}`;


    console.log("Total Income:", totalIncome);

    console.log("Total Expenses:", totalExpenses);

    console.log("Balance:", balance);

}


// =====================================================
// FILTER TRANSACTIONS
// =====================================================

function getFilteredTransactions() {

    const searchText =
        searchInput.value.toLowerCase().trim();

    const selectedType =
        typeFilter.value;

    const selectedCategory =
        categoryFilter.value;


    return transactions.filter(function(transaction) {

        const matchesSearch =
            transaction.title
                .toLowerCase()
                .includes(searchText);


        const matchesType =
            selectedType === "all" ||
            transaction.type === selectedType;


        const matchesCategory =
            selectedCategory === "all" ||
            transaction.category === selectedCategory;


        return (
            matchesSearch &&
            matchesType &&
            matchesCategory
        );

    });

}


// =====================================================
// RENDER TRANSACTIONS
// =====================================================

function renderTransactions() {

    transactionsList.innerHTML = "";


    const filteredTransactions =
        getFilteredTransactions();


    if (filteredTransactions.length === 0) {

        transactionsList.innerHTML = `
            <p class="no-transactions">
                No transactions found.
            </p>
        `;

        return;

    }


    filteredTransactions.forEach(function(transaction) {

        transactionsList.innerHTML +=
            createTransactionHTML(transaction);

    });


    // =================================================
    // EDIT BUTTONS
    // =================================================

    const editButtons =
        document.querySelectorAll(".edit-button");


    editButtons.forEach(function(button) {

        button.addEventListener("click", function() {

            const id =
                Number(button.dataset.id);


            const transaction =
                transactions.find(function(transaction) {

                    return transaction.id === id;

                });


            if (!transaction) {
                return;
            }


            console.log(
                "Transaction found:",
                transaction
            );


            titleInput.value =
                transaction.title;

            amountInput.value =
                transaction.amount;

            typeInput.value =
                transaction.type;

            categoryInput.value =
                transaction.category;

            dateInput.value =
                transaction.date;

            descriptionInput.value =
                transaction.description;


            editingTransactionId =
                transaction.id;


            document
                .getElementById("form-title")
                .textContent =
                "Edit Transaction";


            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        });

    });


    // =================================================
    // DELETE BUTTONS
    // =================================================

    const deleteButtons =
        document.querySelectorAll(".delete-button");


    deleteButtons.forEach(function(button) {

        button.addEventListener("click", function() {

            const id =
                Number(button.dataset.id);


            const shouldDelete =
                confirm(
                    "Are you sure you want to delete this transaction?"
                );


            if (!shouldDelete) {
                return;
            }


            transactions =
                transactions.filter(
                    function(transaction) {

                        return transaction.id !== id;

                    }
                );


            saveTransactions(transactions);

            calculateTotals();

            renderTransactions();

        });

    });

}


// =====================================================
// FORM SUBMISSION
// =====================================================

transactionForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        formError.textContent = "";


        const title =
            titleInput.value.trim();

        const amount =
            Number(amountInput.value);

        const type =
            typeInput.value;

        const category =
            categoryInput.value;

        const date =
            dateInput.value;

        const description =
            descriptionInput.value.trim();


        // =================================================
        // VALIDATION
        // =================================================

        if (title === "") {

            formError.textContent =
                "Please enter a title.";

            return;

        }


        if (amount <= 0 || isNaN(amount)) {

            formError.textContent =
                "Amount must be greater than 0.";

            return;

        }


        if (type === "") {

            formError.textContent =
                "Please select a transaction type.";

            return;

        }


        if (category === "") {

            formError.textContent =
                "Please select a category.";

            return;

        }


        if (date === "") {

            formError.textContent =
                "Please select a date.";

            return;

        }


        // =================================================
        // CREATE TRANSACTION OBJECT
        // =================================================

        const transaction = {

            id:
                editingTransactionId !== null
                    ? editingTransactionId
                    : Date.now(),

            title: title,

            amount: amount,

            type: type,

            category: category,

            date: date,

            description: description

        };


        // =================================================
        // ADD OR UPDATE
        // =================================================

        if (editingTransactionId === null) {

            transactions.push(transaction);

        }

        else {

            const index =
                transactions.findIndex(
                    function(transaction) {

                        return (
                            transaction.id ===
                            editingTransactionId
                        );

                    }
                );


            if (index !== -1) {

                transactions[index] =
                    transaction;

            }


            editingTransactionId = null;


            document
                .getElementById("form-title")
                .textContent =
                "Add Transaction";

        }


        // =================================================
        // SAVE + UPDATE UI
        // =================================================

        saveTransactions(transactions);

        console.log(transactions);

        calculateTotals();

        renderTransactions();


        // Clear form

        transactionForm.reset();

    }
);


// =====================================================
// SEARCH
// =====================================================

searchInput.addEventListener(
    "input",
    function() {

        renderTransactions();

    }
);


// =====================================================
// TYPE FILTER
// =====================================================

typeFilter.addEventListener(
    "change",
    function() {

        renderTransactions();

    }
);


// =====================================================
// CATEGORY FILTER
// =====================================================

categoryFilter.addEventListener(
    "change",
    function() {

        renderTransactions();

    }
);


// =====================================================
// INITIAL PAGE LOAD
// =====================================================

calculateTotals();

renderTransactions();
// =====================================================
// EXPORT TRANSACTIONS TO CSV
// =====================================================

const exportButton =
    document.getElementById("export-button");


exportButton.addEventListener(
    "click",
    function() {

        if (transactions.length === 0) {

            alert("No transactions to export.");

            return;

        }


        const headers = [
            "Title",
            "Amount",
            "Type",
            "Category",
            "Date",
            "Description"
        ];


        const rows = transactions.map(
            function(transaction) {

                return [
                    transaction.title,
                    transaction.amount,
                    transaction.type,
                    transaction.category,
                    transaction.date,
                    transaction.description
                ];

            }
        );


        const csvContent = [
            headers,
            ...rows
        ]
            .map(function(row) {

                return row.join(",");

            })
            .join("\n");


        const blob = new Blob(
            [csvContent],
            {
                type: "text/csv"
            }
        );


        const url =
            URL.createObjectURL(blob);


        const link =
            document.createElement("a");


        link.href = url;

        link.download =
            "expense-transactions.csv";


        link.click();


        URL.revokeObjectURL(url);

    }
);