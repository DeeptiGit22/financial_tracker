export  const COLORS = ["#ff6384", "#36a2eb", "#ffce56", "#4bc0c0", "#9966ff"];

export const TYPE = [{
	label:'Income',
	value:'income'
},
{
	label:'Expense',
	value:'expense'
}]

export const MONTHS = [
  { label: "January", value: "01" },
  { label: "February", value: "02" },
  { label: "March", value: "03" },
  { label: "April", value: "04" },
  { label: "May", value: "05" },
  { label: "June", value: "06" },
  { label: "July", value: "07" },
  { label: "August", value: "08" },
  { label: "September", value: "09" },
  { label: "October", value: "10" },
  { label: "November", value: "11" },
  { label: "December", value: "12" }
];
export const MONTH_MAP: Record<string, string> = {
	"01": "jan",
	"02": "feb",
	"03": "mar",
	"04": "apr",
	"05": "may",
	"06": "jun",
	"07": "jul",
	"08": "aug",
	"09": "sep",
	"10": "oct",
	"11": "nov",
	"12": "dec",
};

export const MONTH_ORDER = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];
export const CATEGORIES = [
  { label: "Salary", value: "salary" },
  { label: "Freelance", value: "freelance" },
  { label: "Investments", value: "investments" },
  { label: "Gifts", value: "gifts" },
  { label: "Other Income", value: "other_income" },
  { label: "Rent", value: "rent" },
  { label: "Groceries", value: "groceries" },
  { label: "Utilities", value: "utilities" },
  { label: "Transportation", value: "transportation" },
  { label: "Healthcare", value: "healthcare" },
  { label: "Entertainment", value: "entertainment" },
  { label: "Dining Out", value: "dining_out" },
  { label: "Shopping", value: "shopping" },
  { label: "Education", value: "education" },
  { label: "Insurance", value: "insurance" },
  { label: "Food", value: "food" },
  { label: "Other Expenses", value: "other_expenses" }
];



export const formatMonth = (month: string) => {
	const monthNames: { [key: string]: string } = {
		January: "Jan",
		February: "Feb",
		March: "Mar",
		April: "Apr",
		May: "May",
		June: "Jun",
		July: "Jul",
		August: "Aug",
		September: "Sep",
		October: "Oct",
		November: "Nov",
		December: "Dec",
	};
	return monthNames[month] || month; // Default to original if not found
};
