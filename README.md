# Personal Expense Tracker

A simple, responsive web application for tracking income and expenses, monitoring spending habits, and managing personal finances.

## Features

- **Transaction Management:** Add, edit, and delete income and expense transactions.
- **Dashboard:** View total income, total expenses, and current balance.
- **Categories:** Organize transactions by category and view category-wise spending.
- **Search and Filters:** Find transactions using search, transaction type, and category filters.
- **Monthly Spending Insights:** Compare this month's expenses with the previous month.
- **Spending Chart:** Visualize expenses by category using a doughnut chart.
- **CSV Export:** Export transaction data for use in spreadsheets.
- **Persistent Storage:** Save transactions in browser localStorage.
- **Responsive Design:** Use the application on desktop and mobile screens.

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Chart.js
- Browser localStorage

## Getting Started

1. Clone or download this repository.
2. Open the project folder in VS Code.
3. Open `index.html` in your browser, or run it using the Live Server extension in VS Code.

No backend or database setup is required.

## How Data Is Stored

The application uses browser localStorage to save transaction data. Transactions remain available after refreshing the page in the same browser, but they are not automatically synchronized across devices.

Clearing the browser's site data may remove saved transactions. Export your transactions regularly to keep a backup.

## Future Improvements

- Add budget limits and budget alerts.
- Add more detailed reports and date-range filters.
- Add cloud storage and user authentication.

## Author

Developed as a personal project to practice frontend web development and JavaScript.