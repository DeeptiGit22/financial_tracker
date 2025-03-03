const Footer =()=>{
    const date = new Date();
    const year = date.getFullYear();
    return (
			<footer className='bg-dark text-white text-center py-3 mt-4'>
				<p className='mb-0'>© {year} Financial Tracker. All rights reserved.</p>
			</footer>
		);
}

export default Footer