const mongoose = require('mongoose');

// Define User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  mobileNumber: {
    type: String,
    required: true
  },
  balance: {
    type: Number,
    default: 0
  },
  Password: {
    type: String,
    required: true
  }
});

// Define Expense Schema
const expenseSchema = new mongoose.Schema({
  payerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  participants: {
    type: Map,
    of: Number, // Amount
    required: true
  },
  type: {
    type: String,
    enum: ['EQUAL', 'EXACT', 'PERCENT'],
    required: true
  }
});

// Define User model
const User = mongoose.model('UserSplitWise', userSchema);

// Define Expense model
const Expense = mongoose.model('ExpenseSplitWise', expenseSchema);

module.exports = { User, Expense };
