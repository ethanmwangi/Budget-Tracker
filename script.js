let expenses = [];
let totalAmount = 0;

const categorySelect = document.getElementById('category-select');
const amountInput = document.getElementById('amount-input');
const dateInput = document.getElementById('date-input');
const addBtn = document.getElementById('add-btn');
const expensesTableBody = document.getElementById('expenses-table-body');
const totalAmountCell = document.getElementById('total-amount');
const chartCanvas = document.getElementById('chart');
const darkToggle = document.getElementById('dark-toggle');

let chart;

function renderChart() {
  const categories = {};
  expenses.forEach(exp => {
    categories[exp.category] = (categories[exp.category] || 0) + exp.amount;
  });

  const labels = Object.keys(categories);
  const data = Object.values(categories);

  if (chart) chart.destroy();

  chart = new Chart(chartCanvas, {
    type: 'pie',
    data: {
      labels,
      datasets: [{
        label: 'Spending by Category',
        data,
        backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56']
      }]
    }
  });
}

function updateTotal() {
  totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  totalAmountCell.textContent = `KES ${totalAmount.toFixed(2)}`;
}

function saveToCookies() {
  document.cookie = `expenses=${JSON.stringify(expenses)};path=/`;
}

function loadFromCookies() {
  const cookie = document.cookie.split('; ').find(row => row.startsWith('expenses='));
  if (cookie) {
    expenses = JSON.parse(cookie.split('=')[1]);
    expenses.forEach(addExpenseRow);
    updateTotal();
    renderChart();
  }
}

function addExpenseRow(expense) {
  const newRow = expensesTableBody.insertRow();
  newRow.insertCell().textContent = expense.category;
  newRow.insertCell().textContent = `KES ${expense.amount.toFixed(2)}`;
  newRow.insertCell().textContent = expense.date;

  const deleteCell = newRow.insertCell();
  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.classList.add('delete-btn');
  deleteBtn.addEventListener('click', () => {
    expenses = expenses.filter(e => e !== expense);
    expensesTableBody.removeChild(newRow);
    updateTotal();
    saveToCookies();
    renderChart();
  });
  deleteCell.appendChild(deleteBtn);
}

addBtn.addEventListener('click', () => {
  const category = categorySelect.value;
  const amount = parseFloat(amountInput.value);
  const date = dateInput.value;

  if (!category || isNaN(amount) || amount <= 0 || !date) {
    alert('Please fill in all fields correctly.');
    return;
  }

  const expense = { category, amount, date };
  expenses.push(expense);
  addExpenseRow(expense);
  updateTotal();
  saveToCookies();
  renderChart();

  amountInput.value = '';
  dateInput.value = '';
});

darkToggle.addEventListener('change', () => {
  document.body.classList.toggle('dark');
});

window.addEventListener('DOMContentLoaded', loadFromCookies);
