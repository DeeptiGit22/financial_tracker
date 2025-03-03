import { Link, useLocation } from "react-router-dom";

const Header = () => {
	const location = useLocation();

	return (
		<header className='bg-primary text-white p-3'>
			<div className='container'>
				<nav className='navbar navbar-expand-lg navbar-dark'>
					<Link className='navbar-brand' to='/'>
						Finance Tracker
					</Link>
					<button
						className='navbar-toggler'
						type='button'
						data-bs-toggle='collapse'
						data-bs-target='#navbarNav'
						aria-controls='navbarNav'
						aria-expanded='false'
						aria-label='Toggle navigation'>
						<span className='navbar-toggler-icon'></span>
					</button>
					<div className='collapse navbar-collapse' id='navbarNav'>
						<ul className='navbar-nav ms-auto'>
							<li className='nav-item'>
								<Link
									className={`nav-link ${
										location.pathname === "/" ? "active" : ""
									}`}
									to='/'>
									Dashboard
								</Link>
							</li>
							<li className='nav-item'>
								<Link
									className={`nav-link ${
										location.pathname === "/transactions" ? "active" : ""
									}`}
									to='/transactions'>
									Transactions
								</Link>
							</li>
							<li className='nav-item'>
								<Link
									className={`nav-link ${
										location.pathname === "/transactions-history"
											? "active"
											: ""
									}`}
									to='/transactions-history'>
									Transactions History
								</Link>
							</li>
							<li className='nav-item'>
								<Link
									className={`nav-link ${
										location.pathname === "/budgets" ? "active" : ""
									}`}
									to='/budgets'>
									Budgets
								</Link>
							</li>
							<li className='nav-item'>
								<Link
									className={`nav-link ${
										location.pathname === "/reports" ? "active" : ""
									}`}
									to='/reports'>
									Reports
								</Link>
							</li>
							{/* <li className='nav-item'>
								<Link
									className={`nav-link ${
										location.pathname === "/settings" ? "active" : ""
									}`}
									to='/settings'>
									Settings
								</Link>
							</li> */}
						</ul>
					</div>
				</nav>
			</div>
		</header>
	);
};

export default Header;
