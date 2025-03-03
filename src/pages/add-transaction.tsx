import { useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { FinancialContext } from "../context/FinancialContext";

const transactionSchema = Yup.object().shape({
	type: Yup.string().required("Transaction type is required"),
	amount: Yup.number()
		.positive("Amount must be positive")
		.required("Amount is required"),
	category: Yup.string().required("Category is required"),
	date: Yup.date().required("Date is required"),
	description: Yup.string(),
});

const AddTransaction = () => {
	const navigate = useNavigate();
	const { type, categories, addTransaction } = useContext(FinancialContext);

	const handleSubmit = (values: any, { resetForm }: any) => {
		addTransaction(values);
		toast.success("Transaction Adedd Successfully");
		setTimeout(() => {
			navigate("/transactions-history");
		}, 2000);
	};

	return (
		<div className='container mt-4'>
			<h2>Add Transaction</h2>
			<Formik
				initialValues={{
					type: "",
					amount: "",
					category: "",
					date: "",
					description: "",
				}}
				validationSchema={transactionSchema}
				onSubmit={handleSubmit}>
				{({ values, setFieldValue }) => (
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
							Add Transaction
						</button>
					</Form>
				)}
			</Formik>
			<ToastContainer />
		</div>
	);
};

export default AddTransaction;
