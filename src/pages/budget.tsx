import { useContext, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

import { FinancialContext } from "../context/FinancialContext";
import { CATEGORIES, MONTH_MAP, MONTHS } from "../constants/constans";
import Loader from "../components/Loader";

const BudgetSetter = () => {
	const { transactions, budgets, categories, addBudget } =
		useContext(FinancialContext);

	const [selectedMonth, setSelectedMonth] = useState("jan");
	const [selectedCategory, setSelectedCategory] = useState("Food");
	const [budget, setBudget] = useState("");

	const handleSaveBudget = () => {
		if (!selectedMonth || !selectedCategory || !budget) {
			alert("Please fill all fields before saving.");
			return;
		}

		const newBudgetAmount = Number(budget);

		const monthName = MONTH_MAP[selectedMonth] || selectedMonth;

		addBudget({
			month: monthName,
			category: selectedCategory,
			amount: newBudgetAmount,
		});

		toast.success("Budget Added Successfully!!");

		// Reset fields
		setSelectedMonth("");
		setSelectedCategory("");
		setBudget("");
	};

	return (
		<>
			{!budgets && !transactions ? (
				<Loader />
			) : (
				<div className='container mt-4'>
					<h2 className='mb-3'>Set Monthly Budget</h2>
					<div className='row g-3'>
						<div className='col-md-4'>
							<label className='form-label'>Select Month</label>
							<select
								className='form-select'
								value={selectedMonth}
								onChange={(e) => setSelectedMonth(e.target.value)}>
								<option value=''>Select Month</option>
								{MONTHS.map((month: any, index: any) => (
									<option key={index} value={month.value}>
										{month.label}
									</option>
								))}
							</select>
						</div>
						<div className='col-md-4'>
							<label className='form-label'>Select Category</label>
							<select
								className='form-select'
								value={selectedCategory}
								onChange={(e) => setSelectedCategory(e.target.value)}>
								<option value=''>Select Category</option>
								{categories &&
									categories.map((category: any, index: any) => (
										<option key={index} value={category.value}>
											{category.label}
										</option>
									))}
							</select>
						</div>
						<div className='col-md-4'>
							<label className='form-label'>Budget Amount</label>
							<input
								type='number'
								className='form-control'
								value={budget}
								onChange={(e) => setBudget(e.target.value)}
								placeholder='Enter amount'
							/>
						</div>
					</div>
					<button className='btn btn-primary mt-3' onClick={handleSaveBudget}>
						Save Budget
					</button>
					<div className='container mx-auto mt-6'>
						<h2 className='text-center text-2xl font-semibold mb-4'>
							Monthly Budget Overview
						</h2>
						<div className='space-y-6'>
							<div className='row'>
								{MONTHS.map((month: any) => {
									const monthBudget = budgets.budgets.find(
										(budget: any) => budget.month === MONTH_MAP[month.value]
									);

									const monthTransactions = transactions.data.filter(
										(t: any) => t.date.split("-")[1] === month.value
									);

									return (
										<div className='col-12 col-md-6'>
											<div
												className='bg-white shadow-lg rounded-lg p-5'
												key={month.value}>
												<h3 className='text-lg font-semibold text-gray-800 mb-4'>
													{month.label}
												</h3>
												<table className='w-full border-collapse border border-gray-300'>
													<thead>
														<tr className='bg-gray-200 text-gray-700'>
															<th className='border border-gray-300 p-2 text-left'>
																Category
															</th>
															<th className='border border-gray-300 p-2 text-left'>
																Budget Limit
															</th>
															<th className='border border-gray-300 p-2 text-left'>
																Expenses
															</th>
															<th className='border border-gray-300 p-2 text-left'>
																Status
															</th>
														</tr>
													</thead>
													<tbody>
														{CATEGORIES.map((category: any) => {
															const categoryBudget =
																monthBudget?.categories.find(
																	(c: any) => c[category.value]
																);
															const categoryExpenses = monthTransactions
																.filter(
																	(t: any) => t.category === category.value
																)
																.reduce(
																	(sum: number, t: any) => sum + t.amount,
																	0
																);

															const budgetLimit = categoryBudget
																? categoryBudget[category.value].limit
																: 0;

															// Calculate progress percentage
															const progressPercentage =
																budgetLimit > 0
																	? Math.min(
																			(categoryExpenses / budgetLimit) * 100,
																			100
																	  )
																	: 0;

															return (
																<tr key={category.value}>
																	<td className='border border-gray-300 p-2'>
																		{category.label}
																	</td>
																	<td className='border border-gray-300 p-2'>
																		{budgetLimit > 0
																			? `₹${budgetLimit}`
																			: "Not Set"}
																	</td>
																	<td className='border border-gray-300 p-2'>
																		₹{categoryExpenses}
																	</td>
																	<td className='border border-gray-300 p-2'>
																		<div className='flex items-center'>
																			{/* Progress Bar */}
																			<div
																				className='progress'
																				style={{ minWidth: "150px" }}>
																				<div
																					className={`progress-bar ${
																						budgetLimit == 0 ||
																						categoryExpenses == 0
																							? "bg-light"
																							: categoryExpenses > budgetLimit
																							? "bg-danger"
																							: "bg-success"
																					}`}
																					role='progressbar'
																					style={{
																						width: `${progressPercentage}%`,
																						color: "black",
																					}}>
																					{progressPercentage.toFixed(0)}%
																				</div>
																			</div>
																			<span
																				style={{
																					color:
																						categoryExpenses > budgetLimit
																							? "#DC3545"
																							: "#198754",
																					fontSize: "12px",
																				}}>
																				{budgetLimit == 0 ||
																				categoryExpenses == 0
																					? ""
																					: categoryExpenses > budgetLimit
																					? "Budget Exceeded"
																					: "Within Budget"}
																			</span>
																		</div>
																	</td>
																</tr>
															);
														})}
													</tbody>
												</table>
											</div>
										</div>
									);
								})}
							</div>
						</div>
					</div>
				</div>
			)}
			<ToastContainer />
		</>
	);
};

export default BudgetSetter;
