import React, { useState, useEffect, useContext } from "react";
import { FinancialContext } from "../context/FinancialContext";
import Pagination from "../components/Pagination";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

const TransactionHistory: React.FC = () => {
	const navigate = useNavigate();

	const { transactions, categories, removeTransaction } =
		useContext(FinancialContext);
	const [sortedTransactions, setSortedTransactions] = useState<any[]>([]);
	const [sortBy, setSortBy] = useState<{ key: string; ascending: boolean }>({
		key: "date",
		ascending: true,
	});
	const [filterCategory, setFilterCategory] = useState<string>("");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");

	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 5;

	useEffect(() => {
		if (transactions) {
			setSortedTransactions(transactions.data);
		}
	}, [transactions]);

	// Handle Sorting
	const handleSort = (key: string) => {
		const isAscending = sortBy.key === key ? !sortBy.ascending : true;
		const sortedData = [...sortedTransactions].sort((a, b) => {
			if (key === "amount") {
				return isAscending ? a.amount - b.amount : b.amount - a.amount;
			} else if (key === "date") {
				return isAscending
					? new Date(a.date).getTime() - new Date(b.date).getTime()
					: new Date(b.date).getTime() - new Date(a.date).getTime();
			} else {
				return isAscending
					? a[key].localeCompare(b[key])
					: b[key].localeCompare(a[key]);
			}
		});

		setSortBy({ key, ascending: isAscending });
		setSortedTransactions(sortedData);
	};

	// Handle Filtering
	const handleFilter = () => {
		let filteredData = transactions.data;

		if (filterCategory) {
			filteredData = filteredData.filter(
				(transaction: any) => transaction.category === filterCategory
			);
		}

		if (startDate) {
			filteredData = filteredData.filter(
				(transaction: any) => new Date(transaction.date) >= new Date(startDate)
			);
		}

		if (endDate) {
			filteredData = filteredData.filter(
				(transaction: any) => new Date(transaction.date) <= new Date(endDate)
			);
		}

		setSortedTransactions(filteredData);
	};

	// Handle Clearing Filters
	const handleClearFilters = () => {
		setFilterCategory("");
		setStartDate("");
		setEndDate("");
		setSortedTransactions(transactions.data);
	};

	// handle Edit

	const handleEdit = (id: any) => {
		navigate(`/transactions/${id}`);
	};

	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const paginatedTransactions = sortedTransactions.slice(
		indexOfFirstItem,
		indexOfLastItem
	);

	return (
		<>
			{!transactions ? (
				<Loader />
			) : (
				<div className='container mt-4'>
					<h2>Transaction History</h2>
					<div className='row mb-3'>
						<div className='col-md-3'>
							<label>Category:</label>
							<select
								className='form-control'
								value={filterCategory}
								onChange={(e) => setFilterCategory(e.target.value)}>
								<option value=''>All</option>
								{categories.map((category: any, index: any) => (
									<option key={index} value={category.value}>
										{category.label}
									</option>
								))}
							</select>
						</div>
						<div className='col-md-3'>
							<label>Start Date:</label>
							<input
								type='date'
								className='form-control'
								value={startDate}
								onChange={(e) => setStartDate(e.target.value)}
							/>
						</div>
						<div className='col-md-3'>
							<label>End Date:</label>
							<input
								type='date'
								className='form-control'
								value={endDate}
								onChange={(e) => setEndDate(e.target.value)}
							/>
						</div>
						<div className='col-md-3 d-flex align-items-end'>
							<button className='btn btn-primary mx-1' onClick={handleFilter}>
								Apply Filters
							</button>
							<button
								className='btn btn-secondary'
								onClick={handleClearFilters}>
								Clear Filters
							</button>
						</div>
					</div>
					<table className='table table-bordered'>
						<thead>
							<tr>
								<th
									onClick={() => handleSort("date")}
									style={{ cursor: "pointer" }}>
									Date{" "}
									{sortBy.key === "date"
										? sortBy.ascending
											? "🔼"
											: "🔽"
										: ""}
								</th>
								<th>Category</th>
								<th
									onClick={() => handleSort("amount")}
									style={{ cursor: "pointer" }}>
									Amount{" "}
									{sortBy.key === "amount"
										? sortBy.ascending
											? "🔼"
											: "🔽"
										: ""}
								</th>
								<th
									onClick={() => handleSort("type")}
									style={{ cursor: "pointer" }}>
									Type{" "}
									{sortBy.key === "type"
										? sortBy.ascending
											? "🔼"
											: "🔽"
										: ""}
								</th>
								<th>Description</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{paginatedTransactions.length > 0 ? (
								paginatedTransactions.map((transaction: any) => (
									<tr key={transaction.id}>
										<td>{transaction.date}</td>
										<td>{transaction.category}</td>
										<td>₹{transaction.amount}</td>
										<td>{transaction.type}</td>
										<td>{transaction.desc}</td>
										<td>
											<button
												className='btn btn-warning btn-sm mx-1'
												onClick={() => handleEdit(transaction.id)}>
												Edit
											</button>
											<button
												className='btn btn-danger btn-sm'
												onClick={() => removeTransaction(transaction.id)}>
												Delete
											</button>
										</td>
									</tr>
								))
							) : (
								<tr>
									<td colSpan={6} className='text-center'>
										No transactions found
									</td>
								</tr>
							)}
						</tbody>
					</table>
					<Pagination
						totalItems={sortedTransactions.length}
						itemsPerPage={itemsPerPage}
						currentPage={currentPage}
						onPageChange={setCurrentPage}
					/>
				</div>
			)}
		</>
	);
};

export default TransactionHistory;
