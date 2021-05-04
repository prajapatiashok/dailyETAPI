const { Router } = require("express");
const Expense = require("../models/expense");
const auth = require("../middleware/auth");
const router = new Router();

router.post("/expenses", auth, async (req, res) => {
  const date = req.body.date.split("-");
  const expense = new Expense({
    ...req.body,
    year_month: `${date[0]}-${date[1]}`,
    owner: req.user._id,
  });
  try {
    await expense.save();
    res.status(201).send(expense);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.delete("/expenses/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const expense = await Expense.findOneAndDelete({
      _id,
      owner: req.user._id,
    });
    if (!expense) {
      return res.status(404).send({ error: "Expense is not found" });
    }
    res.send(expense);
  } catch (e) {
    res.status(500).send(e);
  }
});


router.get("/expenses", auth, async (req, res) => {
  const match = {};
  let totalDayExpense = "";
  try {
    if (req.query.date === "") return;

    if (req.query.date) {
      match.date = req.query.date;
    }

    await req.user
      .populate({
        path: "expenses",
        match,
      })
      .execPopulate();
    const overallData = req.user.expenses;

    totalDayExpense = overallData.reduce(
      (n, { amount }) => n + parseInt(amount),
      0
    );
    res.send({ overallData, totalDayExpense });
  } catch (e) {
    res.status(500).send(e);
  }
});


router.get("/expenses/stat", auth, async (req, res) => {
  const match = {};
  let totalMonthExpense = "";

  try {
    if (req.query.year_month) {
      match.year_month = req.query.year_month;
    }

    await req.user
      .populate({
        path: "expenses",
        match,
      })
      .execPopulate();

    const overallData = req.user.expenses;

    totalMonthExpense = overallData.reduce(
      (n, { amount }) => n + parseInt(amount),
      0
    );

    let filteredData = {};

    overallData.map((el) => {
      if (Object.keys(filteredData).includes(el.date)) {
        filteredData[el.date] = filteredData[el.date] + parseInt(el.amount);
      } else {
        filteredData[el.date] = parseInt(el.amount);
      }
      return filteredData;
    });

    const groupValue = Object.keys(filteredData).map((el) => {
      return { date: el, amount: filteredData[el] };
    });

    res.send({ data: groupValue, totalMonthExpense });
  } catch (e) {
    console.log(e, "sdfljaks");
    res.status(500).send(e);
  }
});

router.patch("/expenses/:id", auth, async (req, res) => {
  const _id = req.params.id;
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "amount"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid update!" });
  }

  try {
    const expense = await Expense.findOne({ _id, owner: req.user._id });
    updates.forEach((update) => (expense[update] = req.body[update]));
    await expense.save();
    if (!expense) {
      return res.status(404).send();
    }
    res.send(expense);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
