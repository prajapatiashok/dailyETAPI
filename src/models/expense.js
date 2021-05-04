const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    amount: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true
    },
    year_month: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
},
//  {
//     timestamps: true
// }
)

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;