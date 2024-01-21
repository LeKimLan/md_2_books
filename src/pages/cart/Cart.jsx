import React, {useEffect} from 'react'
import { Table } from 'react-bootstrap';
import './cart.scss'
import { useSelector, useDispatch } from 'react-redux';
// import { convertToVND } from '@mieuteacher/meomeojs'
import { userAction } from '@slices/user.slice'
import { productAction } from '@slices/product.slice'
import api from '@services/apis'
import { useNavigate } from 'react-router-dom';

export default function Cart() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const userStore = useSelector(store => store.userStore)
    const productStore = useSelector(store => store.productStore)

    useEffect(() => {
		window.scrollTo(0, 0);
	},[])

    function handleGetProductById(productId) {
        return productStore.data?.find(product => product.id == productId) || false
    }

    function week() {
        return {
            plan: "week",
            status: "borrowing",
            totalFee: Number(userStore.cart?.detail?.reduce((total, cur) => {
                return total + cur.quantity * handleGetProductById(cur.productId).fee
            }, 0) || 0),
            pendingAt: String(Date.now())
        }
    }

    function month() {
        return {
            plan: "month",
            status: "borrowing",
            totalFee: Number(userStore.cart?.detail?.reduce((total, cur) => {
                return total + cur.quantity * handleGetProductById(cur.productId).fee
            }, 0) || 0),
            acceptedAt: String(Date.now())
        }
    }

    function handlePay(e, data) {
        e.preventDefault();
        let plan = data.value
        let patchData = null;
        if (plan == "week") patchData = week();
        if (plan == "month") patchData = month();

        api.receiptApi.addToCart(userStore.cart?.id, patchData)
            .then(res => {
                if (res.status == 200) {
                    dispatch(userAction.setCart(null))
                    dispatch(userAction.addReceipt(res.data))
                }
            })
            .catch(err => {
                // loi
            })
    }

    return (
        <div className='cart_page'>
            <h3>Your Cart id: {userStore.cart?.id}</h3>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Book cover</th>
                        <th>Title</th>
                        <th>Fee</th>
                        <th>Note</th>
                        <th>Tools</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        userStore.cart?.detail.map((item, index) => (
                            <tr key={Date.now() * Math.random()}>
                                <td>{index + 1}</td>
                                <td>
                                    <img src={handleGetProductById(item.productId).avatar} style={{width: "100px", height: "140px"}} onClick={() => {
                                        navigate(`/${productStore.data?.find(product => product.id == item.productId).title + '-' +
                                        productStore.data?.find(product => product.id == item.productId).id}`)
                                    }}/>
                                </td>
                                <td>
                                    {handleGetProductById(item.productId).title}
                                </td>
                                <td>
                                    {(handleGetProductById(item.productId).fee)}
                                </td>
                                <td>
                                    {/* {convertToVND(handleGetProductById(item.productId).price * item.quantity)} */}
                                </td>
                                <td>
                                    <button onClick={async () => {
                                        if (!window.confirm("are you sure?")) {
                                            return
                                        } else {
                                            let deleteBook = productStore.data?.find(book => book.id == item.productId)
                                            console.log("delete book", deleteBook)
                                            let newData = {
                                                ...deleteBook,
                                                borrowing: deleteBook.borrowing - 1
                                            }
                                            await api.productApi.update(newData.id, newData)
                                                .then(res => {
                                                    if (res.status == 200) {
                                                        dispatch(productAction.updateProduct(newData))
                                                    }
                                                })
                                                .catch((err) => {
                                                    console.log('err', err)
                                                })
                                            let patchData = {
                                                detail: [
                                                    ...userStore.cart.detail.filter(itemF => itemF.productId != item.productId)
                                                ]
                                            }
                                            api.receiptApi.addToCart(userStore.cart?.id, patchData)
                                                .then(res => {
                                                    if (res.status == 200) {
                                                        dispatch(userAction.setCart(res.data))
                                                    }
                                                })
                                                .catch(err => {
                                                    // loi
                                                })
                                        }

                                    }} className='btn btn-danger'>delete</button>
                                </td>
                            </tr>
                        ))
                    }
                    <tr>
                        <td>
                            Số lượng
                        </td>
                        <td>
                            {
                                userStore.cart?.detail?.reduce((total, cur) => {
                                    return total + cur.quantity
                                }, 0) || 0
                            }
                        </td>
                        <td>Tổng Phí</td>
                        <td>
                            {
                                userStore.cart?.detail?.reduce((total, cur) => {
                                    return total + cur.quantity * handleGetProductById(cur.productId).fee
                                }, 0) || 0
                            }
                        </td>
                        <td>
                            {/* <div>
                            <select name="payMode" id="payMode">
                                <option value="cash">Cash</option>
                                <option value="zaloPay">ZaloPay</option>
                            </select>
                            </div> */}
                            <div>
                                <span>Thời gian thuê: </span>
                                <select name="plan" id="plan">
                                    <option value="week">Tuần</option>
                                    <option value="month">Tháng</option>
                                </select>
                            </div>
                        </td>
                        <td>
                            <button className='btn btn-primary' onClick={(e) => {
                                handlePay(e, document.querySelector('select'))
                            }}>Thuê</button>
                            {/* {
                                convertToVND(userStore.cart?.detail?.reduce((total, cur) => {
                                    return total + (cur.quantity * handleGetProductById(cur.productId).price)
                                }, 0) || 0)
                            } */}
                        </td>
                    </tr>
                </tbody>
            </Table>
        </div>
    )
}
