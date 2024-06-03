import { Request, Response } from 'express';
 // Import ExpenseService class from ExpenseService module
import Authservice from '../Service/Auth_service'; // Import Authservice from Service module

export const Signup = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("calling from controller");
    res.status(200).send(await Authservice.Signup(req.body));
  } catch (err) {
    res.status(401).send({ status: "failed to save data", error: err });
  }
};

export const Login = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("calling from controller");
    res.status(200).send(await Authservice.login(req.body));
  } catch (err) {
    res.status(401).send({ status: "failed to get data", error: err });
  }
};

export const addNewExpense = async (req: Request, res: Response): Promise<void> => {
  try {
    const { payerId, amount, participants, type } = req.body;
    const expenseData = { payerId, amount, participants, type };

    // Instantiate an object of the ExpenseService class
    const expenseService = new ExpenseService();

    // Call the addExpense method on the instantiated object
    await expenseService.addExpense(expenseData);

    res.status(201).json({ message: 'Expense added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
