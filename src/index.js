const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user')
const expenseRouter = require('./routers/expense')

//define routers

const app = express();
const port = process.env.PORT || 3000;

//to parse the request body automatically
app.use(express.json())
app.use(userRouter);
app.use(expenseRouter);


app.listen(port, () => {
    console.log("server is running on port " + port)
})

