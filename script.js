document.addEventListener('DOMContentLoaded', () => {
	const incomeList = document.querySelector('#income-list');
	const expenseList = document.querySelector('#expense-list');

	const incomes = [];
	const expenses = [];

	document.querySelector('#add-income').addEventListener('click', () => {
		const incomeNameElement = document.querySelector('#income-name');
		const incomeAmountElement = document.querySelector('#income-amount');
		const name = incomeNameElement.value;
		const amount = parseFloat(incomeAmountElement.value);
		if (name && amount) {
			incomes.push({name, amount});
			updateList(incomeList, incomes);
			updateTotals();
			incomeNameElement.value = '';
			incomeAmountElement.value = '';
		}
	});

	document.querySelector('#add-expense').addEventListener('click', () => {
		const expenseNameElement = document.querySelector('#expense-name');
		const expenseAmountElement = document.querySelector('#expense-amount');
		const name = expenseNameElement.value;
		const amount = parseFloat(expenseAmountElement.value);
		if (name && amount) {
			expenses.push({name, amount});
			updateList(expenseList, expenses);
			updateTotals();
			expenseNameElement.value = '';
			expenseAmountElement.value = '';
		}
	});

	function updateList(list, source) {
		list.replaceChildren();
		source.forEach((element, index) => {
			const li = document.createElement('li');
			li.innerHTML = `
					<div class='row mt-2'>
						<div class='col-8' style='text-align: start'>
							<span>${element.name} - ${element.amount} zł</span>
						</div>
						<div class='col-4'>
							<span class='input-group'>
								<button class="btn btn-primary edit">Edytuj</button>
								<button class="btn btn-danger delete">Usuń</button>
							</span>
						</div>
					</div>`;
			list.appendChild(li);

			li.querySelector('.delete').addEventListener('click', () => {
				source.splice(index, 1);
				updateList(list, source);
				updateTotals();
			});

			li.querySelector('.edit').addEventListener('click', () => {
				const newName = prompt("Podaj nową nazwę", element.name);
				const newAmount = parseFloat(prompt("Podaj nową wartość", element.amount));
				console.log(newName, newAmount);
				source[index] = {name: newName, amount: newAmount};
				updateList(list, source);
				updateTotals();
			})
		});
	}

	function updateTotals() {
		const totalIncome = incomes.map(income => income.amount).reduce((a, b) => a + b, 0);
		const totalExpense = expenses.map(expense => expense.amount).reduce((a, b) => a + b, 0);

		document.querySelector('#total-income').innerText = totalIncome;
		document.querySelector('#total-expenses').innerText = totalExpense;
		const balance = totalIncome - totalExpense;
		const balanceContainer = document.querySelector('.balance-message');
		if (balance > 0) {
			balanceContainer.innerText = `Możesz jeszcze wydać ${balance.toFixed(2)} złotych.`;
		} else if (balance === 0) {
			balanceContainer.innerText = 'Bilans wynosi zero.';
		} else {
			balanceContainer.innerText = `Bilans jest ujemny. Jesteś na minusie ${Math.abs(balance).toFixed(2)} złotych.`;
		}
	}
});
