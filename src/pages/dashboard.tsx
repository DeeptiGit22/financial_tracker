import React, { useContext, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
	Bar,
	BarChart,
	Cell,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { COLORS, MONTH_ORDER } from "../constants/constans";
import { FinancialContext } from "../context/FinancialContext";
import Loader from "../components/Loader";

const Dashboard = () => {
	const { transactions, budgets } = useContext(FinancialContext);

	const totalIncome =
		transactions &&
		transactions.data.reduce((acc: number, curr: any) => {
			return curr.type === "income" ? acc + curr.amount : acc;
		}, 0);

	const totalExpense =
		transactions &&
		transactions.data.reduce((acc: number, curr: any) => {
			return curr.type === "expense" ? acc + curr.amount : acc;
		}, 0);

	const totalBudget = budgets?.budgets.reduce((total: number, item: any) => {
		return (
			total +
			item.categories.reduce((sum: number, category: { limit: any }) => {
				return sum + Object.values(category)[0].limit;
			}, 0)
		);
	}, 0);

	// Calculate Savings (20% of income)
	const totalSavings = totalIncome * 0.2;

	// Calculate Remaining Budget
	const remainingBudget =
		totalIncome - (totalBudget + totalExpense + totalSavings);

	// Find Top Expense Categories
	const expenseCategories =
		transactions &&
		transactions.data
			.filter((t: any) => t.type === "expense")
			.reduce((acc: any, t: any) => {
				acc[t.category] = (acc[t.category] || 0) + t.amount;
				return acc;
			}, {});

	const sortedCategories =
		expenseCategories &&
		Object.entries(expenseCategories)
			.map(([category, amount]) => ({ category, amount }))
			.sort((a: any, b: any) => b.amount - a.amount)
			.slice(0, 3);

	//Monthly Expenses chart
	const expenseChartData =
		transactions?.data
			?.filter((t: any) => t.type === "expense")
			?.reduce((acc: Record<string, number>, t: any) => {
				const month = new Date(t.date).toLocaleString("en-US", {
					month: "short",
				});
				acc[month] = (acc[month] || 0) + t.amount;
				return acc;
			}, {}) || {};

	const expenseChartArray = Object.entries(expenseChartData)
		.map(([month, total]) => ({
			month,
			total,
		}))
		.sort(
			(a: any, b: any) =>
				MONTH_ORDER.indexOf(a.month) - MONTH_ORDER.indexOf(b.month)
		);

	const categoryChartData =
		transactions?.data
			?.filter((t: any) => t.type === "expense")
			?.reduce((acc:any, t: any) => {
				acc[t.category] = (acc[t.category] || 0) + t.amount; 
				return acc;
			}, {}) || {};

	// Convert to array for charting
	const categoryChartArray = Object.entries(categoryChartData).map(
		([category, total]) => ({
			category,
			total,
		})
	);
	return (
		<>
			{!transactions && !budgets ? (
				<Loader/>
			) : (
				<div className='container mt-4'>
					<h2 className='mb-4'>Dashboard</h2>

					<div className='row'>
						{/* Summary Cards */}
						<div className='col-md-3'>
							<div className='card text-white bg-success mb-3'>
								<div className='card-body'>
									<h5 className='card-title'>Total Income</h5>
									<p className='card-text'>₹{totalIncome}</p>
								</div>
							</div>
						</div>
						<div className='col-md-3'>
							<div className='card text-white bg-danger mb-3'>
								<div className='card-body'>
									<h5 className='card-title'>Total Expenses</h5>
									<p className='card-text'>₹{totalExpense}</p>
								</div>
							</div>
						</div>
						<div className='col-md-3'>
							<div className='card text-white bg-primary mb-3'>
								<div className='card-body'>
									<h5 className='card-title'>Remaining Budget</h5>
									<p className='card-text'>₹{remainingBudget.toFixed(0)}</p>
								</div>
							</div>
						</div>
						<div className='col-md-3'>
							<div className='card text-white bg-info mb-3'>
								<div className='card-body'>
									<h5 className='card-title'>Savings(20% of Income)</h5>
									<p className='card-text'>₹{totalSavings.toFixed(2)}</p>
								</div>
							</div>
						</div>
					</div>

					{/* Top Expenses Section */}
					<h4 className='mt-4'>Top Expense Categories</h4>
					<ul className='list-group'>
						{sortedCategories &&
							sortedCategories.map((item: any, index: any) => (
								<li
									key={index}
									className='list-group-item d-flex justify-content-between align-items-center'>
									{item.category}
									<span className='badge bg-primary'>₹{item.amount}</span>
								</li>
							))}
					</ul>

					{/* Charts */}
					<div className='row mt-4'>
						<div className='col-md-6'>
							<div className='card'>
								<div className='card-body'>
									<h5 className='card-title'>Monthly Spending Trend</h5>
									<ResponsiveContainer width='100%' height={350}>
										<BarChart data={expenseChartArray}>
											<XAxis dataKey='month' />
											<YAxis />
											<Tooltip />
											<Bar dataKey='total' fill='rgba(255, 99, 132, 0.6)' />
										</BarChart>
									</ResponsiveContainer>
								</div>
							</div>
						</div>
						<div className='col-md-6'>
							<div className='card'>
								<div className='card-body'>
									<h5 className='card-title'>Expense Breakdown by Category</h5>

									{/* Pie Chart */}
									<ResponsiveContainer width='100%' height={350}>
										<PieChart>
											<Pie
												data={categoryChartArray}
												dataKey='total'
												nameKey='category'
												cx='50%'
												cy='50%'
												outerRadius={120}
												label>
												{categoryChartArray.map((entry, index) => (
													<Cell
														key={`cell-${index}`}
														fill={COLORS[index % COLORS.length]}
													/>
												))}
											</Pie>
											<Tooltip />
										</PieChart>
									</ResponsiveContainer>

									{/* Custom Legend */}
									<div className=''>
										<ul className='list-unstyled d-flex flex-wrap'>
											{categoryChartArray.map((entry: any, index: any) => (
												<li
													key={index}
													className='d-flex align-items-center me-3'
													style={{ fontSize: "14px" }}>
													<span
														style={{
															display: "inline-block",
															width: "12px",
															height: "12px",
															backgroundColor: COLORS[index % COLORS.length],
															marginRight: "5px",
															borderRadius: "50%",
														}}></span>
													{entry.category}
												</li>
											))}
										</ul>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default Dashboard;
