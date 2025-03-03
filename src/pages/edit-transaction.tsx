import{ useContext} from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

import { FinancialContext } from "../context/FinancialContext";
import Loader from "../components/Loader";


const transactionSchema = Yup.object().shape({
	type: Yup.string().required("Transaction type is required"),
	amount: Yup.number()
		.positive("Amount must be positive")
		.required("Amount is required"),
	category: Yup.string().required("Category is required"),
	date: Yup.date().required("Date is required"),
	description: Yup.string(),
});


const EditTransaction = () => {
	const { transactions, type, categories, editTransaction } =
		useContext(FinancialContext);
	const { id } = useParams();
	const navigate = useNavigate();

	const transactionData = transactions?.data?.find(
		(t: any) => t.id === Number(id)
	);

	const handleSubmit = (values: any) => {
		const transaction = {
			...values,
			id: Number(id),
		};

		editTransaction(transaction);
		toast.success("Transaction Updated Successfully");
		setTimeout(() => {
			navigate("/transactions-history");
		}, 2000);
	};

	return (
		<>
			{!transactions ? (
				<Loader/>
			) : (
				<div className='container mt-4'>
					<h2>Edit Transaction</h2>
					<Formik
						initialValues={{
							type: transactionData ? transactionData.type : "",
							amount: transactionData ? transactionData.amount : "",
							category: transactionData ? transactionData.category : "",
							date: transactionData ? transactionData.date : "",
							description: transactionData ? transactionData.desc : "",
						}}
						validationSchema={transactionSchema}
						enableReinitialize
						onSubmit={handleSubmit}>
						{({ setFieldValue }) => (
							<Form>
								<div className='mb-3'>
									<label className='form-label'>Transaction Type</label>
									<Field
										as='select'
										className='form-select'
										name='type'
										onChange={(e: any) => {
											setFieldValue("type", e.target.value);
										}}>
										<option value=''>Select Type</option>
										{type.map((selectType: any, index: number) => (
											<option key={index} value={selectType.value}>
												{selectType.label}
											</option>
										))}
									</Field>
									<ErrorMessage
										name='type'
										component='div'
										className='text-danger'
									/>
								</div>

								<div className='mb-3'>
									<label className='form-label'>Amount</label>
									<Field type='number' className='form-control' name='amount' />
									<ErrorMessage
										name='amount'
										component='div'
										className='text-danger'
									/>
								</div>

								<div className='mb-3'>
									<label className='form-label'>Category</label>
									<Field
										as='select'
										className='form-select'
										name='category'
										onChange={(e: any) =>
											setFieldValue("category", e.target.value)
										}>
										<option value=''>Select Category</option>
										{categories.map((category: any, index: number) => (
											<option key={index} value={category.value}>
												{category.label}
											</option>
										))}
									</Field>
									<ErrorMessage
										name='category'
										component='div'
										className='text-danger'
									/>
								</div>

								<div className='mb-3'>
									<label className='form-label'>Date</label>
									<Field type='date' className='form-control' name='date' />
									<ErrorMessage
										name='date'
										component='div'
										className='text-danger'
									/>
								</div>

								<div className='mb-3'>
									<label className='form-label'>Description (Optional)</label>
									<Field
										as='textarea'
										className='form-control'
										name='description'
									/>
								</div>

								<button type='submit' className='btn btn-primary'>
									Update Transaction
								</button>
							</Form>
						)}
					</Formik>
					<ToastContainer/>
				</div>
			)}
		</>
	);
};

export default EditTransaction;
