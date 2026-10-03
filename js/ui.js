function formatAmount(amount) {

    return `₹${Number(amount).toFixed(2)}`;

}


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