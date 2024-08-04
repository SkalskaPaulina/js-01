const parser = new DOMParser();

document.addEventListener("DOMContentLoaded", () => {
  const incomeList = document.querySelector("#income-list");
  const expenseList = document.querySelector("#expense-list");
  const editModalElement = document.querySelector("#edit-modal");
  const editModal = new bootstrap.Modal(editModalElement);

  const incomes = [];
  const expenses = [];
  let editedIncome;
  let editedExpense;

  document.querySelectorAll(".validatable").forEach((el) => {
    el.addEventListener("keydown", () => el.classList.remove("is-invalid"));
    el.addEventListener("change", () => el.classList.remove("is-invalid"));
  });

  editModalElement.addEventListener("shown.bs.modal", () => {
    if (editedIncome !== undefined) {
      editModalElement.querySelector("#edit-name").value =
        incomes[editedIncome].name;
      editModalElement.querySelector("#edit-amount").value =
        incomes[editedIncome].amount;
    }

    if (editedExpense !== undefined) {
      editModalElement.querySelector("#edit-name").value =
        incomes[editedExpense].name;
      editModalElement.querySelector("#edit-amount").value =
        incomes[editedExpense].amount;
    }
  });

  editModalElement.querySelector(".accept").addEventListener("click", () => {
    const editNameElement = document.querySelector("#edit-name");
    const editAmountElement = document.querySelector("#edit-amount");
    const name = editNameElement.value;
    const amount = parseFloat(editAmountElement.value);
    if (!name) {
      editNameElement.classList.add("is-invalid");
    }
    if (!amount || amount < 0) {
      editAmountElement.classList.add("is-invalid");
    }
    if (name && amount) {
      if (editedIncome !== undefined) {
        incomes[editedIncome] = { name, amount };
        updateList(incomeList, incomes);
      } else if (editedExpense !== undefined) {
        expenses[editedExpense] = { name, amount };
        updateList(expenseList, expenses);
      }
      updateTotals();
      editModal.hide();
    }
  });

  document.querySelector("#add-income").addEventListener("click", () => {
    const incomeNameElement = document.querySelector("#income-name");
    const incomeAmountElement = document.querySelector("#income-amount");
    const name = incomeNameElement.value;
    const amount = parseFloat(incomeAmountElement.value);
    if (!name) {
      incomeNameElement.classList.add("is-invalid");
    }
    if (!amount || amount < 0) {
      incomeAmountElement.classList.add("is-invalid");
    }
    if (name && amount) {
      incomes.push({ name, amount });
      updateList(incomeList, incomes);
      updateTotals();
      incomeNameElement.value = "";
      incomeAmountElement.value = "";
    }
  });

  document.querySelector("#add-expense").addEventListener("click", () => {
    const expenseNameElement = document.querySelector("#expense-name");
    const expenseAmountElement = document.querySelector("#expense-amount");
    const name = expenseNameElement.value;
    const amount = parseFloat(expenseAmountElement.value);
    if (!name) {
      expenseNameElement.classList.add("is-invalid");
    }
    if (!amount || amount < 0) {
      expenseAmountElement.classList.add("is-invalid");
    }
    if (name && amount) {
      expenses.push({ name, amount });
      updateList(expenseList, expenses);
      updateTotals();
      expenseNameElement.value = "";
      expenseAmountElement.value = "";
    }
  });

  function updateList(list, source) {
    list.replaceChildren();
    source.forEach((element, index) => {
      const htmlString = `
					<li>
						<div class='row mt-2'>
							<div class='col-8' style='text-align: start'>
								<span>${element.name} - ${element.amount} zł</span>
							</div>
							<div class='col-4'>
								<span class='input-group'>
									<button
										class='btn btn-primary edit'
										data-bs-toggle='modal'
										data-bs-target='#edit-modal'
									>
										Edytuj
									</button>
									<button class='btn btn-danger delete'>Usuń</button>
								</span>
							</div>
						</div>
					</li>`;
      const doc = parser.parseFromString(htmlString, "text/html");
      const li = doc.body.firstChild;
      list.appendChild(li);

      li.querySelector(".delete").addEventListener("click", () => {
        source.splice(index, 1);
        updateList(list, source);
        updateTotals();
      });

      li.querySelector(".edit").addEventListener("click", () => {
        if (source === incomes) {
          editedIncome = index;
        } else if (source === expenses) {
          editedExpense = index;
        }
      });
    });
  }

  function updateTotals() {
    const totalIncome = incomes
      .map((income) => income.amount)
      .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    const totalExpense = expenses
      .map((expense) => expense.amount)
      .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

    document.querySelector("#total-income").innerText = totalIncome;
    document.querySelector("#total-expenses").innerText = totalExpense;
    const balance = totalIncome - totalExpense;
    const balanceContainer = document.querySelector(".balance-message");
    const balanceMessage = document.createElement("span");
    if (balance > 0) {
      balanceMessage.textContent = `Możesz jeszcze wydać ${balance.toFixed(
        2
      )} złotych.`;
    } else if (balance === 0) {
      balanceMessage.textContent = "Bilans wynosi zero.";
    } else {
      balanceMessage.textContent = `Bilans jest ujemny. Jesteś na minusie ${Math.abs(
        balance
      ).toFixed(2)} złotych.`;
    }
    balanceContainer.querySelector("span").remove();
    balanceContainer.appendChild(balanceMessage);
  }
});
