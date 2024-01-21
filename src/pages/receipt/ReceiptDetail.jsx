import React from 'react'
import './receiptDetail.scss'
import { Table } from 'react-bootstrap';

export default function ReceiptDetail({ setReceiptDetail, userStore, productStore, currentReceipt }) {
    console.log("productStore", productStore.data)
    return (
        <div className='receipt_detail'>
            <form className='detail_form'>
                <h4>Chi tiết hóa đơn</h4>
                <Table>
                    <thead>
                        <tr>
                            <td>Số lượng</td>
                            <td style={{fontWeight: "bold"}}>
                                {
                                    currentReceipt.detail?.reduce((total, cur) => {
                                        return total + cur.quantity
                                    }, 0) || 0
                                }
                            </td>
                            <td>Tổng phí</td>
                            <td style={{fontWeight: "bold"}}>
                                {
                                    currentReceipt.detail?.reduce((total, cur) => {
                                        return total + cur.quantity * productStore.data?.find(product => product.id == cur.productId).fee
                                    }, 0) || 0
                                }
                            </td>
                            <td></td>
                        </tr>
                        <tr>
                            <th>#</th>
                            <th>Book cover</th>
                            <th>Title</th>
                            <th>Total Fee</th>
                            <th>Note</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            currentReceipt.detail?.map((item, index) => {
                                console.log(item)
                                return (
                                    <tr>
                                        <td>{index + 1}</td>
                                        <td>
                                            <img src={productStore.data?.find(product => product.id == item.productId).avatar} />
                                        </td>
                                        <td>
                                            {productStore.data?.find(product => product.id == item.productId).title}
                                        </td>
                                        <td>
                                            {productStore.data?.find(product => product.id == item.productId).fee}
                                        </td>
                                        <td>
                                            {item.note}
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </Table>
                <button onClick={() => {

                    setReceiptDetail(true)
                }}>X</button>
            </form>
        </div>
    )
}
