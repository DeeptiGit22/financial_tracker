import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

import Header from "./components/Header";
import AddTransaction from "./pages/add-transaction";
import { FinancialProvider } from "./context/FinancialContext";
import BudgetSetter from "./pages/budget";
import TransactionHistory from "./pages/transactions-history";
import EditTransaction from "./pages/edit-transaction";
import Reports from "./pages/reports";
import Footer from "./components/Footer";

const App = () => {
	return (
		<FinancialProvider>
			<Router>
				<Header />
				<Routes>
					<Route path='/' element={<Dashboard />} />
					<Route path='/transactions' element={<AddTransaction />} />
					<Route path='/transactions/:id' element={<EditTransaction />} />
					<Route path='/budgets' element={<BudgetSetter />} />
					<Route
						path='/transactions-history'
						element={<TransactionHistory />}
					/>
					<Route path='/reports' element={<Reports />} />
				</Routes>
				<Footer/>
			</Router>
		</FinancialProvider>
	);
};

export default App;
