import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { productAction } from '@slices/product.slice'
import { uploadToFirebase } from '@/firebase.js'
import api from '@services/apis'


export default function ProductCreate({ categoryStore }) {
    const dispatch = useDispatch()
    const [category, setCategory] = useState([])

    async function handleCreateProduct (e) {
        e.preventDefault();
        let newProduct = {
            title: e.target.title.value,
            author: e.target.author.value,
            avatar: await uploadToFirebase(e.target.avatar.files[0]),
            publisher: e.target.publisher.value,
            publicationDate: Date.parse(e.target.publicationDate.value),
            preface: e.target.preface.value,
            fee: e.target.fee.value,
            categories: category,
            copy: e.target.copy.value,
            borrowing: 0,
            status: true,
            rating: 0,
            review: [],
            acquireDate: Date.now(),
        }
        api.productApi.create(newProduct)
            .then(res => {
                if (res.status == 201) {
                    dispatch(productAction.addNewProduct(res.data))
                    dispatch(productAction.changeStateCreateModal())
                }
            })
    }

    Date.apply
    return (
        <div className='product_create'>
            <form onSubmit={(e) => {
                handleCreateProduct(e)
            }}>
                <div className='btn_box'>
                    <h3>CREATE PRODUCT</h3>
                    <button onClick={() => {
                        dispatch(productAction.changeStateCreateModal())
                    }} type='button' className='btn btn-danger'>X</button>
                </div>
                <div >
                    Title: <input name='title' type="text" />
                </div>
                <div >
                    Author: <input name='author' type="text" />
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
                    Publisher: <input name='publisher' type="text" />
                </div>
                <div >
                    Publication date: <input type="date" name='publicationDate' />
                </div>
                <div>
                    Book cover: <input name='avatar' type="file" onChange={(e) => {
                        if (e.target.files.length != 0) {
                            let imgEl = e.target.parentNode.querySelector("img").src = URL.createObjectURL(e.target.files[0])
                        }
                    }} /> <img src="https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg" style={{ width: "100px", height: "140px" }} />
                </div>
                <div className='container_data'>
                    Preface: <textarea name="preface" cols="50" rows="4"></textarea>
                </div>
                <div >
                    Copy: <input name='copy' type="text" />
                </div>
                <div >
                    Fee: <input name='fee' type="number" />
                </div>
                <div className='btn_box save'>
                    <button type='submit' className='btn btn-success'>save</button>
                </div>
            </form>
        </div>
    )
}
