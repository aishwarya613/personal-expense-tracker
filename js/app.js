console.log("Expense Tracker is running!");


// ==============================
// DOM ELEMENTS
// ==============================

const formError = document.getElementById("form-error");

const balanceElement = document.getElementById("balance");

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

const submitButton =
    document.getElementById("submit-button");


// ==============================
// APPLICATION DATA
// ==============================

let transactions = loadTransactions();

let editingTransactionId = null;


// ==============================
// PREVENT MOUSE WHEEL
// FROM CHANGING AMOUNT
// ==============================

amountInput.addEventListener(
    "wheel",
    function(event) {

        event.preventDefault();

    }
);


// ==============================
// CALCULATE TOTALS
// ==============================

function calculateTotals() {

    let totalIncome = 0;

    let totalExpenses = 0;


    transactions.forEach(
        function(transaction) {

            if (transaction.type === "income") {

                totalIncome += transaction.amount;

            } else {

                totalExpenses += transaction.amount;

            }

        }
    );


    const balance =
        totalIncome - totalExpenses;


    totalIncomeElement.textContent =
        `₹${totalIncome.toFixed(2)}`;

    totalExpensesElement.textContent =
        `₹${totalExpenses.toFixed(2)}`;

    balanceElement.textContent =
        `₹${balance.toFixed(2)}`;


    console.log(
        "Total Income:",
        totalIncome
    );

    console.log(
        "Total Expenses:",
        totalExpenses
    );

    console.log(
        "Balance:",
        balance
    );
}


// ==============================
// FORM SUBMISSION
// ==============================

transactionForm.addEventListener(
    "submit",
    function(event) {

        // Prevent normal HTML form submission
        event.preventDefault();


        // Clear previous error
        formError.textContent = "";


        // ==========================
        // VALIDATION
        // ==========================

        if (
            titleInput.value.trim() === ""
        ) {

            formError.textContent =
                "Please enter a title.";

            return;
        }


        if (
            Number(amountInput.value) <= 0
        ) {

            formError.textContent =
                "Amount must be greater than 0.";

            return;
        }


        if (typeInput.value === "") {

            formError.textContent =
                "Please select a transaction type.";

            return;
        }


        if (categoryInput.value === "") {

            formError.textContent =
                "Please select a category.";

            return;
        }


        if (dateInput.value === "") {

            formError.textContent =
                "Please select a date.";

            return;
        }


        // ==========================
        // CREATE TRANSACTION OBJECT
        // ==========================

        const transaction = {

            id:
                editingTransactionId !== null
                    ? editingTransactionId
                    : Date.now(),

            title:
                titleInput.value.trim(),

            amount:
                Number(amountInput.value),

            type:
                typeInput.value,

            category:
                categoryInput.value,

            date:
                dateInput.value,

            description:
                descriptionInput.value.trim()

        };


        // ==========================
        // ADD OR UPDATE
        // ==========================

        if (
            editingTransactionId === null
        ) {

            // ADD NEW TRANSACTION

            transactions.push(
                transaction
            );

        } else {

            // UPDATE EXISTING TRANSACTION

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

        }


        // ==========================
        // SAVE DATA
        // ==========================

        saveTransactions(
            transactions
        );


        console.log(
            "Transactions:",
            transactions
        );


        // ==========================
        // UPDATE UI
        // ==========================

        calculateTotals();

        renderTransactions();


        // ==========================
        // RESET FORM
        // ==========================

        transactionForm.reset();

        submitButton.textContent =
            "Add Transaction";

    }
);


// ==============================
// EDIT / DELETE BUTTONS
// ==============================

function attachTransactionButtons() {

    const editButtons =
        document.querySelectorAll(
            ".edit-btn"
        );


    const deleteButtons =
        document.querySelectorAll(
            ".delete-btn"
        );


    // ==========================
    // EDIT
    // ==========================

    editButtons.forEach(
        function(button) {

            button.addEventListener(
                "click",
                function() {

                    const id =
                        Number(
                            button.dataset.id
                        );


                    const transaction =
                        transactions.find(
                            function(transaction) {

                                return (
                                    transaction.id ===
                                    id
                                );

                            }
                        );


                    if (!transaction) {
                        return;
                    }


                    editingTransactionId =
                        id;


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


                    submitButton.textContent =
                        "Update Transaction";


                    window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    });

                }
            );

        }
    );


    // ==========================
    // DELETE
    // ==========================

    deleteButtons.forEach(
        function(button) {

            button.addEventListener(
                "click",
                function() {

                    const id =
                        Number(
                            button.dataset.id
                        );


                    const confirmed =
                        confirm(
                            "Are you sure you want to delete this transaction?"
                        );


                    if (!confirmed) {
                        return;
                    }


                    transactions =
                        transactions.filter(
                            function(transaction) {

                                return (
                                    transaction.id !==
                                    id
                                );

                            }
                        );


                    saveTransactions(
                        transactions
                    );


                    calculateTotals();

                    renderTransactions();

                }
            );

        }
    );

}


// ==============================
// RENDER TRANSACTIONS
// THEN ATTACH BUTTON EVENTS
// ==============================

function updateTransactionUI() {

    renderTransactions();

    attachTransactionButtons();

}


// ==============================
// INITIAL APPLICATION LOAD
// ==============================

calculateTotals();

updateTransactionUI();