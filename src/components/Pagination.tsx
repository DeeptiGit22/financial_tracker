import React from "react";

interface PaginationProps {
	totalItems: number;
	itemsPerPage: number;
	currentPage: number;
	onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
	totalItems,
	itemsPerPage,
	currentPage,
	onPageChange,
}) => {
	const totalPages = Math.ceil(totalItems / itemsPerPage);

	if (totalPages <= 1) return null; // Hide pagination if only one page

	const handlePageChange = (page: number) => {
		if (page >= 1 && page <= totalPages) {
			onPageChange(page);
		}
	};

	return (
		<nav>
			<ul className='pagination justify-content-center'>
				<li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
					<button
						className='page-link'
						onClick={() => handlePageChange(currentPage - 1)}>
						Previous
					</button>
				</li>
				{Array.from({ length: totalPages }, (_, i) => (
					<li
						key={i}
						className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
						<button
							className='page-link'
							onClick={() => handlePageChange(i + 1)}>
							{i + 1}
						</button>
					</li>
				))}
				<li
					className={`page-item ${
						currentPage === totalPages ? "disabled" : ""
					}`}>
					<button
						className='page-link'
						onClick={() => handlePageChange(currentPage + 1)}>
						Next
					</button>
				</li>
			</ul>
		</nav>
	);
};

export default Pagination;
