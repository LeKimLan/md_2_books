import React from 'react'
import { useDispatch } from 'react-redux'
import { categoryAction } from '@slices/category.slice'
import api from '@services/apis'
export default function CategoryCreate() {
    const dispatch = useDispatch()
    async function handleCreateCategory(e) {
        e.preventDefault();
        let newCategory = {
            id: Date.now() * Math.random(),
            title: e.target.title.value,
            deleted : false,
        }
        api.categoryApi.create(newCategory)
            .then(res => {
                if (res.status == 201) {
                    dispatch(categoryAction.addNewCategory(res.data))
                    dispatch(categoryAction.changeStateCreateModal())
                }
            })
    }
    return (
        <div className='category_create'>
            <form onSubmit = {(e) => {
                handleCreateCategory(e)
            }}>
                <div className='btn_box'>
                    <h3>CATEGORY CREATE</h3>
                    <button onClick={() => {
                        dispatch(categoryAction.changeStateCreateModal())
                    }} type='button' className='btn btn-danger'> X</button>
                </div>
                <div className='btn_box text'>
                    Name <input name='title' type="text" />
                </div>
                <div className='btn_box save'>
                    <button type='submit' className='btn btn-success'>save</button>
                </div>
            </form>

        </div>
    )
}
