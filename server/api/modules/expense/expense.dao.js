const fs = require("fs");
const { stringToDate } = require("../../../util/date");

// eslint-disable-next-line no-undef
const db = `${process.cwd()}\\server\\db.json`;

const getExpense = () => {
  return new Promise((resolve, reject) => {
    try {
      const data = fs.readFileSync(db, "utf8");

      const expenses = JSON.parse(data);
      resolve({
        message: "Successfully Retrieved all Expenses",
        expenses: expenses,
        status: 200,
      });
    } catch (e) {
      reject({ message: "Internal Server Error", status: 500 });
    }
  });
};

const addExpense = (expense) => {
  return new Promise((resolve, reject) => {
    if (Object.keys(expense).length === 0) {
      reject({
        message:
          "Empty data is not allowed, please provide some valid data to insert record",
        status: 500,
      });
      throw new Error();
    }

    if (Object.keys(expense).length === 1 && expense.id) {
      reject({
        message: "Please provide some data to add new expense",
        status: 500,
      });
      throw new Error();
    }

    if (
      !(
        expense.id &&
        expense.title &&
        expense.category &&
        expense.description &&
        expense.amount
      )
    ) {
      reject({
        message:
          "Please provide values for id ,title, category, description, amount and expenseDate. All are mandatory data elements",
        status: 500,
      });
      throw new Error();
    }

    try {
      let data = fs.readFileSync(db, "utf8");

      const expenses = JSON.parse(data);

      expenses.map((exp) => {
        if (exp.id === expense.id) {
          reject({
            message: "Expense record is already exist with the given id",
            status: 500,
          });
          throw new Error();
        }
      });

      expense.expenseDate = new Date();
      expenses.push(expense);
      data = JSON.stringify(expenses, null, 4);

      fs.writeFileSync(db, data, "utf8");

      resolve({
        message: "Expense record is added successfully",
        expense: expense,
        status: 201,
      });
    } catch (err) {
      reject({ message: "Internal Server Error", status: 500 });
    }
  });
};

const updateExpense = (id, updatedExpense) => {
  return new Promise((resolve, reject) => {
    try {
      let data = fs.readFileSync(db, "utf8");

      const expenses = JSON.parse(data);

      expenses.map((expense, i) => {
        if (expense.id === id) {
          expenses[i] = updatedExpense;
        }
      });

      data = JSON.stringify(expenses, null, 4);

      fs.writeFileSync(db, data, "utf8");

      resolve({
        message: "Successfully updated Expense",
        expense: updatedExpense,
        status: 200,
      });
    } catch (err) {
      reject({ message: "Internal Server Error", status: 500 });
    }
  });
};

const deleteExpense = (id) => {
  return new Promise((resolve, reject) => {
    try {
      let data = fs.readFileSync(db, "utf8");

      let expenses = JSON.parse(data);

      expenses = expenses.filter((expense) => expense.id !== id);

      data = JSON.stringify(expenses, null, 4);

      fs.writeFileSync(db, data, "utf8");

      resolve({
        message: "Successfully deleted Expense",
        status: 200,
      });
    } catch (err) {
      reject({ message: "Internal Server Error", status: 500 });
    }
  });
};

const getExpenseBetweenDates = (startDate, endDate) => {
  return new Promise((resolve, reject) => {
    try {
      let data = fs.readFileSync(db, "utf8");

      let expenses = JSON.parse(data);

      expenses = expenses.filter((expense) => {
        const expenseDate = stringToDate(expense.expenseDate);

        return (
          expenseDate.getTime() >= startDate.getTime() &&
          (endDate == "Invalid Date" ||
            expenseDate.getTime() <= endDate.getTime())
        );
      });

      resolve({
        message: "Successfully Retrieved all Expenses between given dates",
        expenses: expenses,
        status: 200,
      });
    } catch (err) {
      reject({ message: "Internal Server Error", status: 500 });
    }
  });
};

const getExpenseByCatergoryBetweenDates = (category, startDate, endDate) => {
  return new Promise((resolve, reject) => {
    try {
      let data = fs.readFileSync(db, "utf8");

      let expenses = JSON.parse(data);

      expenses = expenses.filter((expense) => {
        const expenseDate = stringToDate(expense.expenseDate);

        return (
          expense.category == category &&
          expenseDate.getTime() >= startDate.getTime() &&
          (endDate == "Invalid Date" ||
            expenseDate.getTime() <= endDate.getTime())
        );
      });

      resolve({
        message: "Successfully Retrieved all Expenses between given dates",
        expenses: expenses,
        status: 200,
      });
    } catch (err) {
      reject({ message: "Internal Server Error", status: 500 });
    }
  });
};

module.exports = {
  getExpense,
  addExpense,
  updateExpense,
  deleteExpense,
  getExpenseBetweenDates,
  getExpenseByCatergoryBetweenDates,
};
