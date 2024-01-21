import React from 'react'
import { Outlet } from 'react-router'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { productAction } from '@slices/product.slice'
import {categoryAction} from "@slices/category.slice";
export default function Container({ menuState }) {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const menus = [
        {
            title: 'Category',
            child: [
                {
                    title: "Add",
                    link: null,
                    fn: () => {
                        dispatch(categoryAction.changeStateCreateModal())
                        navigate("category/list")
                       
                    }
                },
                {
                    title: "List",
                    link: "category/list",
                    fn: null
                },
                {
                    title: "Recycle",
                    link: "product/recycle",
                    fn: null
                }
            ]
        },
        {
            title: 'Product',
            child: [
                {
                    title: "Add",
                    link: null,
                    fn: () => {
                        dispatch(productAction.changeStateCreateModal())
                        navigate("product/list")
                    }
                },
                {
                    title: "List",
                    link: "product/list",
                    fn: null
                },
                {
                    title: "Recycle",
                    link: "product/recycle",
                    fn: null
                }
            ]
        }
    ]
    return (
        <div className='admin_container'>
            <div className={`${menuState && "hidden"} menu_bar`}>
                {
                    menus.map(item => (
                        <div key={Date.now() * Math.random()} className='menu_item'>
                            <button onClick={(e) => {
                                let targetEl = e.target.parentNode.querySelector('.menu_item_sub');
                                if (targetEl.classList.length > 1) {
                                    targetEl.classList.remove("hidden")
                                } else {
                                    targetEl.classList.add("hidden")
                                }
                            }} className='menu_item_main btn btn-dark'>
                                {item.title}
                            </button>
                            <ul className='menu_item_sub'>
                                {
                                    item.child?.map(supItem => (<li onClick={() => {
                                        if (supItem.fn) {
                                            supItem.fn()
                                        } else {
                                            navigate(supItem.link)
                                        }
                                    }} key={Date.now() * Math.random()}>{supItem.title}</li>))
                                }
                            </ul>
                        </div>
                    ))
                }
            </div>
            <div className='content'>
                {/* <div className='history'>
                    <span>Home</span>
                    <span>Admin</span>
                    <span>Product</span>
                </div> */}
                <div className='content_body'>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}