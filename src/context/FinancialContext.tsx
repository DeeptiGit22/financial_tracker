import React, { createContext, useState, useEffect, ReactNode } from "react";
import { CATEGORIES, TYPE } from "../constants/constans";

// Create Context
export const FinancialContext = createContext<any>(null);

// Context Provider Component
export const FinancialProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [transactions, setTransactions] = useState<any>(null);
	const [budgets, setBudgets] = useState<any>(null);

	const categories = CATEGORIES;
	const type = TYPE;
	const transactionData = transactions?.data || [];

	// Load transactions from localStorage or fetch from db.json
	useEffect(() => {
		const loadTransactions = () => {
			const storedData = localStorage.getItem("transactions");
			const storedBudget = localStorage.getItem("budgets");

			if (storedData) {
				setTransactions(JSON.parse(storedData));
			} else {
				fetch("/db.json")
					.then((res) => res.json())
					.then((data) => {
						setTransactions(data); // Update state
						localStorage.setItem("transactions", JSON.stringify(data)); // Store in localStorage
					})
					.catch((err) => console.error("Error fetching data:", err));
			}
			if (storedBudget) {
				setBudgets(JSON.parse(storedBudget));
			} else {
				fetch("/budget.json")
					.then((res) => res.json())
					.then((data) => {
						setBudgets(data); // Update state
						localStorage.setItem("budgets", JSON.stringify(data)); // Store in localStorage
					})
					.catch((err) => console.error("Error fetching data:", err));
			}
		};
		loadTransactions();
	}, []);

	// Function to add a transaction
	const addTransaction = (transaction: any) => {
		const newId =
			transactionData.length > 0
				? Math.max(...transactionData.map((t: any) => t.id)) + 1
				: 1;
		const newTransaction = {
			id: newId,
			date: transaction.date,
			type: transaction.type,
			category: transaction.category,
			amount: transaction.amount,
			desc: transaction.description,
		};
		const updatedTransactions = {
			...transactions,
			data: [...transactionData, newTransaction],
		};
		setTransactions(updatedTransactions);
		localStorage.setItem("transactions", JSON.stringify(updatedTransactions));
	};

	// Function to edit a transaction
	const editTransaction = (transaction: any) => {
		const updatedTransactions = {
			...transactions,
			data: transactionData.map((t: any) =>
				t.id == transaction.id ? { ...t, ...transaction } : t
			),
		};
		setTransactions(updatedTransactions);
		localStorage.setItem("transactions", JSON.stringify(updatedTransactions));
	};

	// Function to remove a transaction
	const removeTransaction = (id: number) => {
		const updatedTransactions = {
			...transactions,
			data: transactionData.filter((t: any) => t.id !== id),
		};
		setTransactions(updatedTransactions);
		localStorage.setItem("transactions", JSON.stringify(updatedTransactions));
	};

	// add budget
	const addBudget = (newBudget: any) => {
		const existingBudgets = [...budgets.budgets];

		const monthIndex = existingBudgets.findIndex(
			(b: any) => b.month === newBudget.month
		);

		if (monthIndex !== -1) {
			const updatedCategories = [...existingBudgets[monthIndex].categories];

			const categoryIndex = updatedCategories.findIndex(
				(c: any) => c[newBudget.category]
			);

			if (categoryIndex !== -1) {
				updatedCategories[categoryIndex][newBudget.category].limit =
					newBudget.amount;
			} else {
				updatedCategories.push({
					[newBudget.category]: { limit: newBudget.amount },
				});
			}
			existingBudgets[monthIndex] = {
				...existingBudgets[monthIndex],
				categories: updatedCategories,
			};
		} else {
			const newBudgetEntry = {
				id: existingBudgets.length + 101,
				month: newBudget.month,
				categories: [{ [newBudget.category]: { limit: newBudget.amount } }],
			};

			existingBudgets.push(newBudgetEntry);
		}
		const updatedBudget = {
			...budgets,
			budgets: existingBudgets, // Use the modified copy
		};

		// Update state and local storage
		setBudgets(updatedBudget);
		localStorage.setItem("budgets", JSON.stringify(updatedBudget));
	};

	return (
		<FinancialContext.Provider
			value={{
				transactions,
				budgets,
				categories,
				type,
				addTransaction,
				editTransaction,
				removeTransaction,
				addBudget,
			}}>
			{children}
		</FinancialContext.Provider>
	);
};
