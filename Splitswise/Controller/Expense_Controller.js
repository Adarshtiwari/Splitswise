const { User, Expense } = require('../Model/splitwise-Model');

// Function to add an expense with equal splitting
const addEqualExpense = async (req, res, next) => {
  const { payerId, amount, type, participants } = req.body;

  try {
    // Find payer
    const payer = await User.findById(payerId);
    if (!payer) {
      return res.status(404).json({ error: 'Payer not found' });
    }

    // Validate expense type
    if (type !== 'EQUAL' && type !== 'EXACT' && type !== 'PERCENT') {
      return res.status(400).json({ error: 'Invalid expense type' });
    }

    // Validate participants
    for (const participantId of participants) {
      const participant = await User.findById(participantId);
      if (!participant) {
        return res.status(404).json({ error: `Participant with id ${participantId} not found` });
      }
    }

    // Prepare participant amounts based on expense type
    let participantAmounts = {};
    if (type === 'EQUAL') {
      // For EQUAL type, insert the total amount as the value for all participants
      participants.forEach(participantId => {
        participantAmounts[participantId] = amount;
      });
    } else if (type === 'EXACT') {
      // For EXACT type, req.body.shares contains participant amounts
      const totalShares = req.body.shares.reduce((acc, curr) => acc + curr, 0);
      if (totalShares !== amount) {
        return res.status(400).json({ error: 'Total shares do not match the total amount' });
      }
      participants.forEach((participantId, index) => {
        participantAmounts[participantId] = req.body.shares[index];
      });
    } else if (type === 'PERCENT') {
      // For PERCENT type, req.body.percentages contains percentages
      const totalPercentage = req.body.percentages.reduce((acc, curr) => acc + curr, 0);
      if (totalPercentage !== 100) {
        return res.status(400).json({ error: 'Total percentage shares must equal 100' });
      }
      participants.forEach((participantId, index) => {
        participantAmounts[participantId] = (amount * req.body.percentages[index]) / 100;
      });
    }

    // Update payer's balance
    payer.balance += amount;
    await payer.save();

    // Update balances for participants
    for (const participantId of participants) {
      const participant = await User.findById(participantId);
      participant.balance -= participantAmounts[participantId];
      await participant.save();
    }

    // Create expense record
    const expense = new Expense({
      payerId,
      amount,
      participants: participantAmounts,
      type
    });
    await expense.save();

    next()

    // res.json({ message: 'Expense added successfully' });
  } catch (error) {
    console.error('Error adding expense:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



const getExpensesByUserId = async (req, res) => {
  console.log(req.query)
  const userId = req.query.userId;

  try {
    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get expenses where the user is a participant
    
    const expenses = await Expense.find({
      $or: [
        { payerId: userId }, // Check if userId matches payerId
        { [`participants.${userId}`]: { $exists: true } } // Check if userId exists in participants object
      ]
    });


    // console.log("expenses ",expenses)

    // Initialize objects to store own and owes data
    let oweYou = {};
    let owesYou = {};
    
    // Iterate through each expense
    for (let i = 0; i < expenses.length; i++) {
      const expense = expenses[i];
      const payerId = expense.payerId.toString();
  
      // If the user is the payer, calculate the amounts owed by others
      if (payerId === userId) {
          const participantIds = Array.from(expense.participants.keys());
          for (let j = 0; j < participantIds.length; j++) {
              const participantId = participantIds[j];
              const {name:participantName} = await User.findById(participantId);
              if (participantId !== userId) {
                  const amount = expense.participants.get(participantId);
                  if (amount > 0) {
                    
                         console.log("user 2 ", owesYou[participantName])
                      
                      owesYou[participantName] = (owesYou[participantName] || 0) + amount;
                  } else {
                    if(participantName=='User2')
                      {
                         console.log("user 2 ", owesYou[participantName])
                      }
                      owesYou[participantName] = (owesYou[participantName] || 0) - amount;
                  }
              }
          }
      } else {
          // If the user is a participant, calculate the amount owed by the user
          const amountOwed = expense.participants.get(userId) || 0;
          const {name:participantName} = await User.findById(payerId);
          if (amountOwed > 0) {
          
            oweYou[participantName] = (oweYou[participantName] || 0) + amountOwed;
          } else {
            if(participantName=='User2')
              {
                 console.log("user 2 ", oweYou[participantName])
              }
            oweYou[participantName] = (oweYou[participantName] || 0) - amountOwed;
          }
      }
  }
  
  console.log(' before Owe You:', oweYou);
  console.log(' before Owes You:', owesYou);
    
    // Process expenses
  
   await adjustBalances( oweYou, owesYou )


    res.json({oweYou,owesYou});
  } catch (error) {
    console.error('Error getting expenses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};




module.exports = { addEqualExpense,getExpensesByUserId };

const adjustBalances = (oweYou, owesYou) => {
  for (const user in oweYou) {
      if (user in owesYou) {
          const amount = Math.min(oweYou[user], owesYou[user]);
          oweYou[user] -= amount;
          owesYou[user] -= amount;
          if (oweYou[user] <= 0) {
              delete oweYou[user];
          }
          if (owesYou[user] <= 0) {
              delete owesYou[user];
          }
      }
  }

  for (const user in owesYou) {
      if (user in oweYou) {
          const amount = Math.min(owesYou[user], oweYou[user]);
          oweYou[user] -= amount;
          owesYou[user] -= amount;
          if (owesYou[user] <= 0) {
              delete owesYou[user];
          }
          if (oweYou[user] <= 0) {
              delete oweYou[user];
          }
      }
  }
};
