import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { productAction } from '@slices/product.slice'
import { commentAction } from '@slices/comment.slice';
import { userAction } from '@slices/user.slice';
import './productDetail.scss'
import api from '@services/apis'
import utils from '@utils'
import { message } from 'antd'

export default function ProductDetail() {
    const dispatch = useDispatch()
    let { productDetail } = useParams();
    const { accountStore, userStore, productStore, categoryStore, commentStore } = useSelector(store => store)
    let currentProduct = productStore?.data?.find(product => product.id == productDetail.split('-')[1])
    function converTime(timeStamp) {
        let convertedDate = null
        let date = new Date(Number(timeStamp))
        let hour = date.getHours()
        let minute = date.getMinutes()
        let second = date.getSeconds()
        let day = date.getDate()
        let month = date.getMonth()
        let year = date.getFullYear()
        return convertedDate = hour + ':' + minute + ':' + second + ` on ` + day + '/' + month + '/' + year;
    }

    function converDate(timeStamp) {
        let date = new Date(Number(timeStamp))
        let convertedDate = null
        let day = date.getDate()
        let month = date.getMonth()
        let year = date.getFullYear()
        return convertedDate = day + '/' + month + '/' + year;
    }

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    async function handleComment(e) {
        e.preventDefault();

        let newComment = {
            id: Date.now() * Math.random(),
            productId: productDetail.split('-')[1],
            userId: utils.token.decodeToken(localStorage.getItem("token")).id,
            content: e.target.comment.value,
            createAt: Date.now(),
        }
        document.querySelector('form').reset()
        await api.userApi.addComment(newComment)
            .then(res => {
                if (res.status == 201) {
                    dispatch(commentAction.addComment(newComment))
                }
            })
            .catch((err) => {
                console.log('err', err)
            })
    }

    async function getRating(data) {
        let newData = {
            rating: ((currentProduct.rating * currentProduct.ratingCount) + Number(data.target.value)) / (currentProduct.ratingCount + 1),
            ratingCount: currentProduct.ratingCount + 1
        }
        let newProduct = {
            ...currentProduct,
            rating: ((currentProduct.rating * currentProduct.ratingCount) + Number(data.target.value)) / (currentProduct.ratingCount + 1),
            ratingCount: currentProduct.ratingCount + 1
        }
        await api.productApi.update(currentProduct.id, newData)
            .then(res => {
                if (res.status == 200) {
                    dispatch(productAction.updateProduct(newProduct))
                }
            })
            .catch((err) => {
                console.log('err', err)
            })
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
                        ...currentProduct,
                        borrowing: chosenBook.borrowing + 1
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
        }
        else {
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
        <div className='detail-page'>
            <div className='product-detail-box'>
                <div className='product-image'>
                    <img src={currentProduct.avatar} />
                </div>
                <div className='product-details'>
                    <div >
                        Category:
                        {
                            currentProduct?.categories.map(category => {
                                return ` ${categoryStore.data?.find(item => item.id == category).title}`
                            })
                        }
                    </div>
                    <div >
                        Title: {currentProduct.title}
                    </div>
                    <div >
                        Fee: {currentProduct.fee}
                    </div>
                    <div >
                        Preface: {currentProduct.preface}
                    </div>
                    <div>
                        Copy available: {currentProduct.copy - currentProduct.borrowing}/{currentProduct.copy}
                    </div>
                    <div >
                        Publication date: {converDate(currentProduct.publicationDate)}
                    </div>
                    <div>
                        Rating: {(currentProduct.rating).toFixed(2)}
                    </div>
                    <button onClick={() => {
                        console.log('product', currentProduct)
                        handleAddToCart(currentProduct.id)
                    }}>Thuê</button>
                </div>
            </div>
            <div className='comment-site'>
                <div className='input-area'>
                    <div>
                        <form onSubmit={(e) => {
                            handleComment(e)
                        }}>
                            <h4>Bình luận</h4>
                            <textarea name="comment" id="" cols="70" rows="7"></textarea>
                            <button type='submit'>Post</button>
                        </form>
                    </div>
                    <div className='rating'>
                        <div>
                            <h2>Đánh giá</h2>
                        </div>
                        <div>
                            <button value={1} id='rate1' onClick={(item) => {
                                getRating(item)
                            }}>1</button>
                            <button value={2} id='rate2' onClick={(item) => {
                                getRating(item)
                            }}>2</button>
                            <button value={3} id='rate3' onClick={(item) => {
                                getRating(item)
                            }}>3</button>
                            <button value={4} id='rate4' onClick={(item) => {
                                getRating(item)
                            }}>4</button>
                            <button value={5} id='rate5' onClick={(item) => {
                                getRating(item)
                            }}>5</button>
                        </div>
                    </div>
                </div>
                <div className='user-comments'>
                    <h4>Bình luận của độc giả</h4>
                    {
                        commentStore?.data?.map((comment, index) => {
                            if (comment.productId == currentProduct.id) {
                                return (
                                    <div key={Date.now() * Math.random()} className='comment_box'>
                                        <div>
                                            <img src={accountStore?.data?.find(user => user.id == comment.userId).avatar}
                                                style={{ width: "60px", height: "60px", borderRadius: "50%" }} />
                                            <span>{accountStore?.data?.find(user => user.id == comment.userId).userName}</span>
                                        </div>
                                        <div>
                                            {comment.content}
                                        </div>
                                        <div>
                                            Bình luận vào lúc: {converTime(comment.createAt)}
                                        </div>
                                    </div>
                                )
                            }
                        })
                    }
                    <div className="fb-comments" data-href="http://localhost:5173/" data-width="300" data-numposts="5">
                    </div>
                </div>
            </div>
        </div>

    )
}
