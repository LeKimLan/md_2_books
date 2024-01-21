import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Button, Flex, Modal } from 'antd';
import { Dropdown } from 'react-bootstrap';
import pictures from '@/pictures'
import './header.scss'

export default function Header() {
	const { userStore, categoryStore } = useSelector(store => store)
	const navigate = useNavigate()
	// const { t, i18n} = useTranslation();
	const [login, setLogin] = useState(false)

	return (
		<>
			<header>
				<div className='header_content'>
					<div className='store_box'>
						<div className='logo'>
							<img src={pictures.logo} onClick={() => {
								window.location.href = "/"
							}} />
						</div>
						<div className='store_name'>
							Morning Readings
						</div>
					</div>
					<div className='nav_bar'>
						<nav>
							{
								[
									{
										title: "Trang chủ",
										link: "/",
										children: null
									},
									{
										title: "Tin tức",
										children: null
									},
									{
										title: "Khám phá",
										children: [
											{
												title: "Sách bán chạy"
											},
											{
												title: "Sách mới"
											}
										]
									},
									{
										title: "Thể loại",
										children: categoryStore.data
									},
								].map(item => (
									<div className={`item ${item.children && "sub"}`} key={Date.now() * Math.random()} onClick={() => {
										navigate(item.link)
									}}>
										{item.title}
										{
											item.children && (
												<div className='sub_menu'>
													{
														item.children.map(subItem => (
															<div onClick={() => {
																navigate(`/category/${subItem.title.toLowerCase()}`)
															}} key={Date.now() * Math.random()} className='sub_menu_item'>
																{subItem.title}
															</div>
														))
													}
												</div>
											)
										}
									</div>
								))
							}
						</nav>
					</div>
					<div className='user_box'>
						<div className='tools'>
							<i className="item fa-solid fa-magnifying-glass"></i>
							<span onClick={(e) => {
								navigate("/cart")
							}} style={{ cursor: "pointer" }}>
								<i className="item fa-solid fa-bag-shopping"></i>
								(
								{
									userStore.cart?.detail?.reduce((total, cur) => {
										return total + cur.quantity
									}, 0) || 0
								}
								)
							</span>
						</div>
						{
							userStore.data ? (
								<Dropdown>
									<Dropdown.Toggle variant="success" id="dropdown-basic">
										<div className='user_box'>
											<span>hello {isNaN(Number(userStore.data?.userName)) ? userStore.data?.userName :
												userStore.data?.email.split('@')[0]}</span>
											<img src={userStore.data?.avatar} />
										</div>
									</Dropdown.Toggle>

									<Dropdown.Menu>
										<Dropdown.Item>
											<Button color="black" type="primary" ghost onClick={() => {
												window.location.href = '/admin'
											}}>
												admin
											</Button>
										</Dropdown.Item>
										<Dropdown.Item>
											<Button type="primary" ghost onClick={() => {
												window.location.href = '/profile/user_info'
											}}>
												profile
											</Button>
										</Dropdown.Item>
										<Dropdown.Item>
											<Button type="primary" ghost onClick={() => {
												window.location.href = '/receipt'
											}}>
												Receipt
											</Button>
										</Dropdown.Item>
										<Dropdown.Item>
											<Button type="text" danger onClick={() => {
												Modal.confirm({
													content: "bạn có muốn đăng xuất?",
													onOk: () => {
														localStorage.removeItem("token")
														window.location.href = '/'
													}
												})
											}}>
												logout
											</Button></Dropdown.Item>
									</Dropdown.Menu>
								</Dropdown>
							) : (
								<div onClick={() => {
									navigate('/authen')
								}} className='user_authentication'>
									Signin/Signup
								</div>
							)
						}
						<div className='multiple_language'>
							<div onClick={() => {
								localStorage.setItem("locales", "vi")
								i18n.changeLanguage("vi")
							}} className='item'>
								<img src={pictures.flagVN} />
								<span>VN</span>
							</div>
							<div onClick={() => {
								localStorage.setItem("locales", "en")
								i18n.changeLanguage("en")
							}} className='item'>
								<img src={pictures.flagUS} />
								<span>US</span>
							</div>
						</div>
					</div>
				</div>
			</header>
		</>
	)
}
