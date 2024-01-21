import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { productAction } from '@slices/product.slice'
import { uploadToFirebase } from '@/firebase.js'
import api from '@services/apis'

export default function ProductUpdate({ updateProduct, categoryStore }) {
    const dispatch = useDispatch()
    const productStore = useSelector(store => store.productStore)
    const [category, setCategory] = useState(updateProduct.categories)

    function converDate(timeStamp) {
        let date = new Date(Number(timeStamp))
        let convertedDate = null
        let day = date.getDate()
        let month = date.getMonth()
        let year = date.getFullYear()
        return convertedDate = day + '/' + month + '/' + year;
    }

    async function handleUpdateProduct(e) {
        e.preventDefault();
        let newProduct = {
            ...updateProduct,
            title: e.target.title.value,
            author: e.target.author.value,
            avatar: e.target.avatar.files[0] ? await uploadToFirebase(e.target.avatar.files[0]) : updateProduct.avatar,
            publisher: e.target.publisher.value,
            publicationDate: Date.parse(e.target.publicationDate.value),
            preface: e.target.preface.value,
            fee: e.target.fee.value,
            categories: category,
            copy: e.target.copy.value,
            borrowing: 0,
            status: true,
            rating: 0,
            review: []
        }
        await api.productApi.update(newProduct.id, newProduct)
            .then(res => {
                if (res.status == 200) {
                    dispatch(productAction.updateProduct(newProduct))
                    dispatch(productAction.changeStateUpdateModal())
                }
            })
            .catch((err) => {
                console.log('err', err)
            })

    }

    return (
        <div className='product_update'>
            <form onSubmit={(e) => {
                handleUpdateProduct(e)
            }}>
                <div className='btn_box'>
                    <h3>UPDATE PRODUCT</h3>
                    <button onClick={() => {
                        dispatch(productAction.changeStateUpdateModal())
                    }} type='button' className='btn btn-danger'>X</button>
                </div>
                <div >
                    Title: <input name='title' type="text" defaultValue={updateProduct.title} />
                </div>
                <div >
                    Author: <input name='author' type="text" defaultValue={updateProduct.author} />
                </div>
                <div className='category'>
                    <div className='choose_category'>
                        Categories:
                        <select >
                            {
                                categoryStore.data?.map(category => (
                                    <option key={Date.now() * Math.random()} value={category.id}>{category.title}</option>
                                ))
                            }
                        </select>
                        <button onClick={(e) => {
                            e.preventDefault()
                            let existValue = category.find(item => item == document.querySelector('select').value)
                            if (existValue) {
                                return
                            }
                            setCategory([
                                ...category,
                                document.querySelector('select').value
                            ])
                        }}>Chọn</button>
                    </div>
                    <div className='final_category'>
                        {
                            category.map(item => {
                                return (
                                    <button key={Date.now() * Math.random()} type='button' onClick={() => {
                                        setCategory(
                                            category.filter(filterItem => filterItem != item)
                                        )
                                    }}>{
                                            categoryStore.data?.map(categoryTitle => {
                                                if (categoryTitle.id == item) {
                                                    return categoryTitle.title
                                                }
                                            })
                                        }</button>
                                )
                            })
                        }
                    </div>
                </div>
                <div >
                    Publisher: <input name='publisher' type="text" defaultValue={updateProduct.publisher} />
                </div>
                <div >
                    <div>
                        Publication date: <input type="date" name='publicationDate' />
                    </div>
                    <div>
                        Current publication date: <span style={{ fontWeight: "bold" }}>{converDate(updateProduct.publicationDate)}</span>
                    </div>
                </div>
                <div>
                    Book cover: <input name='avatar' type="file" onChange={(e) => {
                        if (e.target.files.length != 0) {
                            let imgEl = e.target.parentNode.querySelector("img").src = URL.createObjectURL(e.target.files[0])
                        }
                    }} /> <img src={updateProduct.avatar} style={{ width: "100px", height: "140px" }} />
                </div>
                <div className='container_data'>
                    Preface: <textarea name="preface" cols="50" rows="4" defaultValue={updateProduct.preface}></textarea>
                </div>
                <div >
                    Copy: <input name='copy' type="text" defaultValue={updateProduct.copy} />
                </div>
                <div>
                    Fee <input name='fee' type="text" defaultValue={updateProduct.fee} />
                </div>
                <div className='btn_box save'>
                    <button type='submit' className='btn btn-success'>save</button>
                </div>
            </form>
        </div>
    )
}
