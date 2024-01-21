import React, { useState } from 'react'
import pictures from '@/pictures'
import { Dropdown } from 'react-bootstrap';
import MenuBtn from '@components/menu_btn/MenuBtn.jsx'
import { useDispatch } from 'react-redux';
import { userAction } from '@slices/user.slice'
import { Modal } from 'antd';

export default function Navbar({ userStore, menuState, setMenuState }) {
  const dispatch = useDispatch()
  return (
    <nav>
      <div className='logo' >
        <img src={pictures.logo} onClick={() => {
        window.location.href = '/'
      }}/>
        <MenuBtn onClickFn={setMenuState} open={menuState} />
      </div>
      <div className='user'>
        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            <span>hi {isNaN(Number(userStore.data?.userName)) ? userStore.data?.userName : userStore.data?.email.split('@')[0]}</span>
            <img src={userStore.data?.avatar} />
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={() => {
              window.location.href = "/"
            }}>Home Page</Dropdown.Item>
            <Dropdown.Item onClick={() => {
              Modal.confirm({
                title: "Logout",
                content: "Ok?",
                onOk: () => {
                  dispatch(userAction.setData(null))
                  localStorage.removeItem("token")
                  window.location.href = "/"
                }
              })
            }}>Logout</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </nav>
  )
}