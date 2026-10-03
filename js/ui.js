function renderTransactions() {

    transactionsList.innerHTML = "";

    if (transactions.length === 0) {

        transactionsList.innerHTML = `
            <p class="empty-message">
                No transactions yet.
            </p>
        `;

        return;
    }


    transactions.forEach(function(transaction) {

        const transactionElement = document.createElement("div");

        transactionElement.classList.add(
            "transaction-item"
        );


        transactionElement.innerHTML = `
            <div class="transaction-info">

                <h3>${transaction.title}</h3>

                <p>
                    ${transaction.category}
                    •
                    ${transaction.date}
                </p>

                ${
                    transaction.description
                        ? `<p class="description">
                            ${transaction.description}
                           </p>`
                        : ""
                }

            </div>


            <div class="transaction-actions">

                <strong class="${transaction.type}">
                    ${
                        transaction.type === "income"
                            ? "+"
                            : "-"
                    }
                    ₹${transaction.amount.toFixed(2)}
                </strong>


                <button
                    class="edit-btn"
                    data-id="${transaction.id}"
                >
                    Edit
                </button>


                <button
                    class="delete-btn"
                    data-id="${transaction.id}"
                >
                    Delete
                </button>

            </div>
        `;


        transactionsList.appendChild(
            transactionElement
        );

    });
}