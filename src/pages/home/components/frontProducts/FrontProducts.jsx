import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import api from '@services/apis'
import { userAction } from '@slices/user.slice'
import { productAction } from '@slices/product.slice'
import { useNavigate } from 'react-router-dom'
import { message } from 'antd'
export default function FrontProducts() {
    const dispatch = useDispatch()
    const { productStore, categoryStore } = useSelector(store => store)
    const userStore = useSelector(store => store.userStore)
    const navigate = useNavigate()

    function getProductCategories(categoryID) {
        if (!productStore.data) return
        let result = [];
        for (let i in productStore.data) {
            if (productStore.data[i].categories === categoryID) {
                result.push(productStore.data[i])
            }
            if (result.length >= 5) break
        }
        return result
    }

    function getMostDemanded(data) {
        if (!data) return
        let mostDemandedList = [];
        for (let i in data) {
            mostDemandedList.push(data[i])
        }
        mostDemandedList.sort(function (a, b) {
            let resultA = a.borrowing * 100 / a.copy
            let resultB = b.borrowing * 100 / b.copy
            return resultB - resultA
        })
        return mostDemandedList
    }

    function getLatestProducts(data) {
        if (!data) return
        let newList = [];
        for (let i in data) {
            newList.push(data[i])
        }
        newList.sort(function (a, b) {
            return a.acquireDate - b.acquireDate
        })
        return newList
    }

    function getMostRating(data) {
        if (!data) return
        let mostRatingList = [];
        for (let i in data) {
            mostRatingList.push(data[i])
        }
        mostRatingList.sort(function (a, b) {
            return b.rating - a.rating
        })
        return mostRatingList
    }

    async function handleAddToCart(productId) {
        if (!userStore.data) {
            alert("Vui lòng đăng nhập!")
            return
        }
        if (userStore.cart) {
            let itemExisted = userStore.cart?.detail?.find(item => item.productId == productId);
            let patchData = null;
            if (itemExisted) {
                message.error('Sách đã có trong giỏ!')
                return
            } else {
                let chosenBook = productStore.data?.find(item => item.id == productId)
                if (chosenBook.copy > chosenBook.borrowing) {
                    let newData = {
                        ...chosenBook,
                        borrowing: chosenBook.borrowing + 1
                    }
                    await api.productApi.update(newData.id, newData)
                        .then(async res => {
                            if (res.status == 200) {
                                await dispatch(productAction.updateProduct(newData))
                            }
                        })
                        .catch((err) => {
                            console.log('err', err)
                        })
                } else {
                    message.error('Sách đã hết phiên bản!')
                    return
                }
                patchData = {
                    detail: [
                        ...userStore.cart.detail,
                        {
                            id: String(Math.ceil(Math.random() * Date.now())),
                            productId,
                            quantity: 1,
                            note: null
                        }
                    ]
                }
            }
            api.receiptApi.addToCart(userStore.cart.id, patchData)
                .then(res => {
                    if (res.status == 200) {
                        dispatch(userAction.setCart(res.data))
                    }
                })
                .catch(err => {
                })
        } else {
            let newReceipt = {
                id: "PAY_" + String(Math.ceil(Math.random() * Date.now())),
                total: 0,
                userId: userStore.data.id,
                createAt: String(Date.now()),
                payMode: "cash",
                paid: false,
                paidAt: null,
                plan: null,
                status: "browsing",
                peddingAt: null,
                acceptedAt: String(Date.now()),
                shippingAt: null,
                doneAt: null,
                detail: [
                    {
                        id: String(Math.ceil(Math.random() * Date.now())),
                        productId,
                        quantity: 1,
                        note: null
                    }
                ]
            }
            api.receiptApi.createReceipt(newReceipt)
                .then(res => {
                    if (res.status == 201) {
                        dispatch(userAction.setCart(res.data))
                    } else {
                    }
                })
                .catch(err => {
                    console.log('err', err)
                })
        }
    }

    return (
        <>
            <div className='new_list'>
                <h3>Sách mới nhất</h3>
                <div className='new_product_row'>
                    {
                        getLatestProducts(productStore.data)?.map((product, index) => {
                            if (index < 5) {
                                return (
                                    <div className='new_product_box' key={Date.now() * Math.random()}>
                                        <div onClick={() => {
                                            navigate(`/${product.title + '-' + product.id}`)
                                        }}>
                                            <div>
                                                <img src={product.avatar} />
                                            </div>
                                            <div className='product_title'>
                                                {product.title}
                                            </div>
                                        </div>
                                        <div className='tools'>
                                            <button onClick={() => {
                                                navigate(`/${product.title + '-' + product.id}`)
                                            }}>Chi tiết</button>
                                            <button onClick={() => {
                                                handleAddToCart(product.id)
                                            }}>Thuê</button>
                                        </div>

                                    </div>
                                )
                            }
                        })
                    }
                </div>
            </div>
            <div className='most_demanded_list'>
                <h3>Sách được quan tâm nhất</h3>
                <div className='most_demanded_row'>
                    {
                        getMostDemanded(productStore.data)?.map((product, index) => {
                            if (index < 5) {
                                return (
                                    <div className='most_demanded_box' key={Date.now() * Math.random()}>
                                        <div onClick={() => {
                                            navigate(`/${product.title + '-' + product.id}`)
                                        }}>
                                            <div>
                                                <img src={product.avatar} />
                                            </div>
                                            <div className='product_title'>
                                                {product.title}
                                            </div>
                                        </div>
                                        <div className='tools'>
                                            <button onClick={() => {
                                                navigate(`/${product.title + '-' + product.id}`)
                                            }}>Chi tiết</button>
                                            <button onClick={() => {
                                                handleAddToCart(product.id)
                                            }}>Thuê</button>
                                        </div>

                                    </div>
                                )
                            }
                        })
                    }
                </div>
            </div>
            <div className='most_demanded_list'>
                <h3>Sách được đánh giá cao nhất</h3>
                <div className='most_demanded_row'>
                    {
                        getMostRating(productStore.data)?.map((product, index) => {
                            if (index < 5) {
                                return (
                                    <div className='most_demanded_box' key={Date.now() * Math.random()}>
                                        <div onClick={() => {
                                            navigate(`/${product.title + '-' + product.id}`)
                                        }}>
                                            <div>
                                                <img src={product.avatar} />
                                            </div>
                                            <div className='product_title'>
                                                {product.title}
                                            </div>
                                        </div>
                                        <div className='tools'>
                                            <button onClick={() => {
                                                navigate(`/${product.title + '-' + product.id}`)
                                            }}>Chi tiết</button>
                                            <button onClick={() => {
                                                handleAddToCart(product.id)
                                            }}>Thuê</button>
                                        </div>

                                    </div>
                                )
                            }
                        })
                    }
                </div>
            </div>
        </>
    )
}
