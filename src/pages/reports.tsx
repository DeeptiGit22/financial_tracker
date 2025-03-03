import { useContext, useEffect, useState } from "react";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
} from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

import { FinancialContext } from "../context/FinancialContext";
import { MONTH_MAP, MONTH_ORDER } from "../constants/constans";
import Loader from "../components/Loader";

const Reports = () => {
	const { transactions } = useContext(FinancialContext);
	const [reportData, setReportData] = useState<any>([]);
	const [summaryIncome, setSummaryIncome] = useState(0);
	const [summaryExpense, setSummarysExpense] = useState(0);
	const [ytdIncome, setYtdIncome] = useState(0);
	const [ytdExpense, setYtdExpense] = useState(0);

	useEffect(() => {
		if (transactions) {
			if (!transactions || transactions.data.length === 0) {
				setReportData([]);
				return;
			}

			const groupedData = transactions.data.reduce((acc: any, curr: any) => {
				const month = curr.date.slice(5, 7);
				const displayMonth = MONTH_MAP[month] || month;
				const formattedMonth =
					displayMonth.charAt(0).toUpperCase() +
					displayMonth.slice(1).toLowerCase();

				if (!acc[displayMonth]) {
					acc[displayMonth] = {
						month: formattedMonth,
						income: 0,
						expense: 0,
					};
				}
				acc[displayMonth][curr.type] += curr.amount;
				return acc;
			}, {});

			const sortedData = Object.values(groupedData).sort(
				(a: any, b: any) =>
					MONTH_ORDER.indexOf(a.month) - MONTH_ORDER.indexOf(b.month)
			);

			setReportData(sortedData);

			const totalIncome = transactions.data.reduce((acc: number, curr: any) => {
				return curr.type === "income" ? acc + curr.amount : acc;
			}, 0);
			setSummaryIncome(totalIncome);

			const totalExpense = transactions.data.reduce(
				(acc: number, curr: any) => {
					return curr.type === "expense" ? acc + curr.amount : acc;
				},
				0
			);

			setSummarysExpense(totalExpense);

			const startIncome =
				transactions.data.find(
					(t: any) => t.type === "income" && t.date.startsWith("2024")
				)?.amount || 1;

			const startExpense =
				transactions.data.find(
					(t: any) => t.type === "expense" && t.date.startsWith("2024")
				)?.amount || 1;

			const ytdIncome = (totalIncome / startIncome - 1) * 100;
			const ytdExpense = (totalExpense / startExpense - 1) * 100;

			setYtdIncome(ytdIncome);
			setYtdExpense(ytdExpense);
		}
	}, [transactions]);

	const exportToPDF = () => {
		const doc = new jsPDF();
		doc.text("Financial Reports", 20, 10);
		autoTable(doc, {
			head: [["Month", "Income", "Expense"]],
			body: reportData.map((row: any) => [
				row.month,
				row.income || 0,
				row.expense || 0,
			]),
		});
		doc.save("financial_report.pdf");
	};

	const exportToExcel = () => {
		const worksheet = XLSX.utils.json_to_sheet(
			reportData.map((row: any) => ({
				Month: row.month,
				Income: row.income || 0,
				Expense: row.expense || 0,
			}))
		);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, "Financial Report");
		XLSX.writeFile(workbook, "financial_report.xlsx");
	};

	return (
		<>
			{!transactions ? (
				<Loader/>
			) : (
				<div className='container mt-4'>
					<h2 className='text-2xl font-bold mb-4'>Financial Reports</h2>

					<div className='bg-gray-100 p-4 rounded-lg shadow mb-6'>
						<h3 className='text-lg font-semibold'>Year-to-Date Analysis</h3>
						<div className='row'>
							<div className='col-12 col-md-6'>
								<p className='text-green-600'>Total Income: ₹{summaryIncome}</p>
							</div>
							<div className='col-12 col-md-6'>
								<p className='text-blue-600'>
									YTD Income Growth: {ytdIncome.toFixed(2)}%
								</p>
							</div>
							<div className='col-12 col-md-6'>
								<p className='text-red-600'>
									Total Expenses: ₹{summaryExpense}
								</p>
							</div>
							<div className='col-12 col-md-6'>
								<p className='text-orange-600'>
									YTD Expense Growth: {ytdExpense.toFixed(2)}%
								</p>
							</div>
						</div>
					</div>

					<h3 className='text-lg font-semibold mb-4 mt-4'>
						Monthly Income vs. Expenses
					</h3>
					{reportData.length > 0 && (
						<ResponsiveContainer width='100%' height={350}>
							<BarChart data={reportData}>
								<XAxis dataKey='month' />
								<YAxis />
								<Tooltip />
								<Bar dataKey='income' fill='#A1D6CB' name='Income' />
								<Bar dataKey='expense' fill='#FF8383' name='Expense' />
							</BarChart>
						</ResponsiveContainer>
					)}

					<div className='mt-6 flex gap-4'>
						<button className='bg-info mx-1 btn' onClick={exportToPDF}>
							Export as PDF
						</button>
						<button className='bg-light btn' onClick={exportToExcel}>
							Export as CSV
						</button>
					</div>
				</div>
			)}
		</>
	);
};

export default Reports;
