import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import './admin.scss'
import Container from './components/Container'
import Navbar from './components/NavBar'
export default function Admin() {
    const [menuState, setMenuState] = useState(false);
    const userStore = useSelector(store => store.userStore)

    useEffect(() => {
        if (!userStore.data) {
            alert("Đăng nhập với tài khoản admin")
            window.location.href = "/"
            return
        }
        if (userStore.data.role != "admin") {
            alert("Người dùng không có quyền admin")
            window.location.href = "/"
            return
        }
    }, [userStore.data])
    return (
        <>
            {
                userStore.data?.role == "admin" && (
                    <div style={{color: 'black'}} className='admin_page'>
                        <Navbar menuState={menuState} setMenuState={setMenuState} userStore={userStore}/>
                        <Container menuState={menuState}/>
                    </div>
                )
            }
        </>
    )
}