// =====================================================
// FORMAT AMOUNT
// =====================================================

function formatAmount(amount) {

    return `₹${Number(amount).toFixed(2)}`;

}


// =====================================================
// CREATE TRANSACTION HTML
// =====================================================

function createTransactionHTML(transaction) {

    const amountClass =
        transaction.type === "income"
            ? "income"
            : "expense";


    const amountSign =
        transaction.type === "income"
            ? "+"
            : "-";


    return `
        <div class="transaction-item">

            <div class="transaction-info">

                <h3>
                    ${transaction.title}
                </h3>

                <p>
                    ${transaction.category}
                    •
                    ${transaction.date}
                </p>

                ${
                    transaction.description
                        ? `<p class="transaction-description">
                            ${transaction.description}
                           </p>`
                        : ""
                }

            </div>


            <div class="transaction-actions">

                <strong class="${amountClass}">
                    ${amountSign}${formatAmount(transaction.amount)}
                </strong>


                <button
                    class="edit-button"
                    data-id="${transaction.id}"
                >
                    Edit
                </button>


                <button
                    class="delete-button"
                    data-id="${transaction.id}"
                >
                    Delete
                </button>

            </div>

        </div>
    `;

}


// =====================================================
// CREATE CATEGORY SUMMARY HTML
// =====================================================

function createCategorySummaryHTML(categoryTotals) {

    const categories =
        Object.keys(categoryTotals);


    if (categories.length === 0) {

        return `
            <p class="no-transactions">
                No expense data available.
            </p>
        `;

    }


    return categories.map(
        function(category) {

            return `
                <div class="category-summary-item">

                    <span class="category-name">
                        ${category}
                    </span>

                    <strong>
                        ${formatAmount(
                            categoryTotals[category]
                        )}
                    </strong>

                </div>
            `;

        }
    ).join("");

}