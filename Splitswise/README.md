Splitwise API Documentation

This API provides functionalities to manage expenses among multiple users. It allows users to add expenses, retrieve expenses by user ID, and calculates the amounts owed between users.

Base URL: http://localhost:8080/

Authentication: Authorization: Bearer <JWT Token> //But not append for Add and get expense

Add Expense: POST=> /users/expenses
            EXACT
                Body {
                     "payerId": "<payer user ID>",
                     "amount": "<total amount>",
                     "type": "EQUAL",
                     "participants": ["<participant user ID>", "<participant user ID>", ...],
                     "shares": [300, 200, 250, 250]
                    }
            PERCENT
                    {
                     "payerId": "665cbcacc81dc12bf77824ea", //user4
                    "amount":  1200,
                    "type": "PERCENT",
                    "participants": [
                        ["<participant user ID>", "<participant user ID>", ...],
                                    ],
                    "percentages": ["<participant Share Percentage Respectively>"...]
                    }
            EQUAL
                    {
                     "payerId": "665cbcacc81dc12bf77824ea", //user4
                    "amount":  1200,
                    "type": "PERCENT",
                    "participants": [
                        ["<participant user ID>", "<participant user ID>", ...],
                                    ]
                    }


             GET=>  /users/expenses send UserId in QueryParam


