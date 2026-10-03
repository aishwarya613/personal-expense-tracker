// =====================================================
// DOM ELEMENTS
// =====================================================

const formError =
    document.getElementById("form-error");

const balanceElement =
    document.getElementById("balance");

const totalIncomeElement =
    document.getElementById("total-income");

const totalExpensesElement =
    document.getElementById("total-expenses");

const transactionsList =
    document.getElementById("transactions-list");

const categorySummary =
    document.getElementById("category-summary");

const spendingChartCanvas =
    document.getElementById("spending-chart");

const dateFilter =
    document.getElementById("date-filter");

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

const searchInput =
    document.getElementById("search");

const typeFilter =
    document.getElementById("type-filter");

const categoryFilter =
    document.getElementById("category-filter");

const exportButton =
    document.getElementById("export-button");


console.log("Expense Tracker is running!");


// =====================================================
// CHART VARIABLE
// =====================================================

let spendingChart = null;


// =====================================================
// APPLICATION STATE
// =====================================================

let transactions =
    loadTransactions();

let editingTransactionId = null;


// =====================================================
// PREVENT MOUSE WHEEL FROM CHANGING AMOUNT
// =====================================================

amountInput.addEventListener(
    "wheel",
    function(event) {

        event.preventDefault();

    }
);


// =====================================================
// CALCULATE TOTALS
// =====================================================

function calculateTotals() {

    let totalIncome = 0;

    let totalExpenses = 0;


    transactions.forEach(
        function(transaction) {

            if (transaction.type === "income") {

                totalIncome +=
                    Number(transaction.amount);

            }

            else if (
                transaction.type === "expense"
            ) {

                totalExpenses +=
                    Number(transaction.amount);

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


// =====================================================
// CHECK DATE FILTER
// =====================================================

function isTransactionInSelectedPeriod(transaction) {

    const selectedPeriod =
        dateFilter.value;


    if (selectedPeriod === "all") {

        return true;

    }


    const transactionDate =
        new Date(
            transaction.date + "T00:00:00"
        );


    const today =
        new Date();


    if (
        selectedPeriod === "this-month"
    ) {

        return (
            transactionDate.getFullYear() ===
                today.getFullYear()

            &&

            transactionDate.getMonth() ===
                today.getMonth()
        );

    }


    if (
        selectedPeriod === "last-month"
    ) {

        const firstDayOfThisMonth =
            new Date(
                today.getFullYear(),
                today.getMonth(),
                1
            );


        const firstDayOfLastMonth =
            new Date(
                today.getFullYear(),
                today.getMonth() - 1,
                1
            );


        return (
            transactionDate >=
                firstDayOfLastMonth

            &&

            transactionDate <
                firstDayOfThisMonth
        );

    }


    return true;

}


// =====================================================
// GET TRANSACTIONS FOR SELECTED PERIOD
// =====================================================

function getPeriodTransactions() {

    return transactions.filter(
        function(transaction) {

            return isTransactionInSelectedPeriod(
                transaction
            );

        }
    );

}


// =====================================================
// CALCULATE CATEGORY TOTALS
// =====================================================

function calculateCategoryTotals() {

    const categoryTotals = {};


    const periodTransactions =
        getPeriodTransactions();


    periodTransactions.forEach(
        function(transaction) {

            if (transaction.type !== "expense") {
                return;
            }


            const category =
                transaction.category;

            const amount =
                Number(transaction.amount);


            if (
                categoryTotals[category] ===
                undefined
            ) {

                categoryTotals[category] = 0;

            }


            categoryTotals[category] +=
                amount;

        }
    );


    return categoryTotals;

}


// =====================================================
// RENDER CATEGORY SUMMARY
// =====================================================

function renderCategorySummary() {

    const categoryTotals =
        calculateCategoryTotals();


    categorySummary.innerHTML =
        createCategorySummaryHTML(
            categoryTotals
        );

}


// =====================================================
// RENDER SPENDING CHART
// =====================================================

function renderSpendingChart() {

    const categoryTotals =
        calculateCategoryTotals();


    const categories =
        Object.keys(categoryTotals);


    const amounts =
        Object.values(categoryTotals);


    if (spendingChart !== null) {

        spendingChart.destroy();

        spendingChart = null;

    }


    if (categories.length === 0) {

        return;

    }


    spendingChart =
        new Chart(
            spendingChartCanvas,
            {
                type: "doughnut",

                data: {

                    labels: categories,

                    datasets: [
                        {
                            label:
                                "Spending",

                            data:
                                amounts
                        }
                    ]

                },

                options: {

                    responsive: true,

                    plugins: {

                        legend: {

                            position: "bottom"

                        }

                    }

                }

            }
        );

}


// =====================================================
// FILTER TRANSACTIONS
// =====================================================

function getFilteredTransactions() {

    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();

    const selectedType =
        typeFilter.value;

    const selectedCategory =
        categoryFilter.value;


    return transactions.filter(
        function(transaction) {

            const matchesSearch =
                transaction.title
                    .toLowerCase()
                    .includes(searchText);


            const matchesType =
                selectedType === "all" ||
                transaction.type === selectedType;


            const matchesCategory =
                selectedCategory === "all" ||
                transaction.category ===
                    selectedCategory;


            return (
                matchesSearch &&
                matchesType &&
                matchesCategory
            );

        }
    );

}


// =====================================================
// RENDER TRANSACTIONS
// =====================================================

function renderTransactions() {

    transactionsList.innerHTML = "";


    const filteredTransactions =
        getFilteredTransactions();


    if (
        filteredTransactions.length === 0
    ) {

        transactionsList.innerHTML = `
            <p class="no-transactions">
                No transactions found.
            </p>
        `;

        return;

    }


    filteredTransactions.forEach(
        function(transaction) {

            transactionsList.innerHTML +=
                createTransactionHTML(
                    transaction
                );

        }
    );


    // =================================================
    // EDIT BUTTONS
    // =================================================

    const editButtons =
        document.querySelectorAll(
            ".edit-button"
        );


    editButtons.forEach(
        function(button) {

            button.addEventListener(
                "click",
                function() {

                    const id =
                        Number(button.dataset.id);


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
                        .getElementById(
                            "form-title"
                        )
                        .textContent =
                        "Edit Transaction";


                    window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    });

                }
            );

        }
    );


    // =================================================
    // DELETE BUTTONS
    // =================================================

    const deleteButtons =
        document.querySelectorAll(
            ".delete-button"
        );


    deleteButtons.forEach(
        function(button) {

            button.addEventListener(
                "click",
                function() {

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

                    renderCategorySummary();

                    renderSpendingChart();

                }
            );

        }
    );

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


        if (title === "") {

            formError.textContent =
                "Please enter a title.";

            return;

        }


        if (
            amount <= 0 ||
            isNaN(amount)
        ) {

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


        if (
            editingTransactionId === null
        ) {

            transactions.push(
                transaction
            );

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


            editingTransactionId =
                null;


            document
                .getElementById(
                    "form-title"
                )
                .textContent =
                "Add Transaction";

        }


        saveTransactions(
            transactions
        );


        console.log(transactions);


        calculateTotals();

        renderTransactions();

        renderCategorySummary();

        renderSpendingChart();


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
// DATE FILTER
// =====================================================

dateFilter.addEventListener(
    "change",
    function() {

        renderCategorySummary();

        renderSpendingChart();

    }
);


// =====================================================
// EXPORT CSV
// =====================================================

exportButton.addEventListener(
    "click",
    function() {

        if (transactions.length === 0) {

            alert(
                "No transactions to export."
            );

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


        const rows =
            transactions.map(
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
            .map(
                function(row) {

                    return row.join(",");

                }
            )
            .join("\n");


        const blob =
            new Blob(
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


// =====================================================
// INITIAL PAGE LOAD
// =====================================================

calculateTotals();

renderTransactions();

renderCategorySummary();

renderSpendingChart();