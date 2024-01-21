import React, { useState } from 'react'
// import './receipt.scss'
import { useSelector, useDispatch } from 'react-redux';
import { Table } from 'react-bootstrap';
import ReceiptDetail from '@/pages/receipt/ReceiptDetail';
import { userAction } from '@slices/user.slice';
import './receipts.scss'

export default function Receipts() {
	const dispatch = useDispatch()
	const userStore = useSelector(store => store.userStore)
	const productStore = useSelector(store => store.productStore)
	const [receiptDetail, setReceiptDetail] = useState(true)
	const [currentReceipt, setCurrentReceipt] = useState([])

	function converDate(timeStamp) {
		let date = new Date(Number(timeStamp))
		let convertedDate = null
		let day = date.getDate()
		let month = date.getMonth()
		let year = date.getFullYear()
		return convertedDate = day + '/' + month + '/' + year;
	}

	return (
		<>
			<div className='receipt_page'>
				{
					receiptDetail ?? <ReceiptDetail setReceiptDetail={setReceiptDetail} userStore={userStore} productStore={productStore}
					currentReceipt={currentReceipt}/>
				}
				<h3>receipt</h3>
				<Table striped bordered hover>
					<thead>
						<tr>
							<th>#</th>
							<th>Receipt ID</th>
							<th>Tổng phí</th>
							<th>Trạng thái</th>
							<th>Tạo ngày</th>
							<th>Thời gian thuê</th>
							<th>Tools</th>
						</tr>
					</thead>
					<tbody>
						{
							userStore?.receipts?.map((receipt, index) => {
								return (
									<tr key={Date.now() * Math.random()}>
										<td>{index + 1}</td>
										<td>
											{receipt.id}
										</td>
										<td>
											{receipt.totalFee}
										</td>
										<td>
											{receipt.status}
										</td>
										<td>
											{converDate(receipt.acceptedAt)}
										</td>
										<td>
											{receipt.plan == "week" ? "Tuần" : "Tháng"}
										</td>
										<td>
											<button onClick={() => {
												setCurrentReceipt(receipt)
												if (receiptDetail == true) {
													setReceiptDetail(null)
												} else {
													setReceiptDetail(true)
												}
											}}>Hiện</button>
										</td>
									</tr>
								)
							})
						}
					</tbody>
				</Table>
			</div>
		</>
	)
}
