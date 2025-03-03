
const Loader = () => {
	return (
		<div
			className='position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-50'
			style={{ zIndex: 1050 }}>
			<div className='text-white fs-4 fw-bold'>Loading...</div>
		</div>
	);
};

export default Loader;
