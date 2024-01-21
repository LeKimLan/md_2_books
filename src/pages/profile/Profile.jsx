import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import './profile.scss'
import { Outlet } from 'react-router'
import { useNavigate } from 'react-router-dom'

export default function Profile() {
    // const [menuState, setMenuState] = useState(false);
    // const userStore = useSelector(store => store.userStore)
    const navigate = useNavigate();

    const menu = [
        {
            title: "Thông tin tài khoản",
            link: "user_info",
        },
        {
            title: "Thông tin mượn sách",
            link: "your_books",
            child: [
                {
                    title: "Sách đang mượn",
                    link: "borrowing"
                },
                {
                    title: "Sách quá hạn",
                    link: "overdue"
                },
            ],
        },
        {
            title: "Biên lai",
            link: "receipts",
        }
    ]

    return (
        <>
            <div className='profile_page'>
                <div className='selections'>
                    {
                        menu.map(item => (
                            <div key={Date.now() * Math.random()}>
                                <div key={Date.now() * Math.random()} onClick={() =>
                                    navigate(item.link)
                                }>
                                    {item.title}
                                </div>
                                <ul>
                                    {
                                        item.child?.map(subItem => (
                                            <li key={Date.now() * Math.random()} onClick={() =>
                                                navigate(subItem.link)
                                            }>
                                                {subItem.title}
                                            </li>
                                        ))
                                    }
                                </ul>
                            </div>
                        ))
                    }
                </div>
                <div className='general_info'>
                    <Outlet />
                </div>
            </div>
        </>
    )
}