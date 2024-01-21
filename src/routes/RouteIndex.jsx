import { BrowserRouter, Route, Routes } from "react-router-dom"
import LazyFn from './lazy/Lazy'
import Home from "../pages/home/Home"
import HomeBody from '@pages/home/pages/HomeBody'
import { useEffect } from 'react'

export default function RouteIndex() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<Home />}>
          <Route path="*" element={<HomeBody />}></Route>
          <Route path="category/:categoryName" element={LazyFn(() => import("@pages/home/pages/categories/Category.jsx"))()}></Route>
          <Route path=":productDetail" element={LazyFn(() => import("@pages/home/pages/productDetail/ProductDetail.jsx"))()}></Route>
          <Route path="cart" element={LazyFn(() => import("@pages/cart/Cart.jsx"))()}></Route>
          <Route path="receipt" element={LazyFn(() => import("@pages/receipt/Receipt.jsx"))()}></Route>
          <Route path="profile" element={LazyFn(() => import("@pages/profile/Profile.jsx"))()}>
            <Route path="user_info" element={LazyFn(() => import("@pages/profile/subPages/userInfo/UserInfo.jsx"))()}></Route>
            <Route path="your_books" element={LazyFn(() => import("@pages/profile/subPages/yourBooks/YourBooks.jsx"))()}></Route>
            <Route path="borrowing" element={LazyFn(() => import("@pages/profile/subPages/yourBooks/borrowing/Borrowing.jsx"))()}></Route>
            <Route path="overdue" element={LazyFn(() => import("@pages/profile/subPages/yourBooks/overdue/Overdue.jsx"))()}></Route>
            <Route path="receipts" element={LazyFn(() => import("@pages/profile/subPages/receipts/Receipts.jsx"))()}></Route>
          </Route>
        </Route>
        <Route path="/admin" element={LazyFn(() => import("@pages/admin/Admin.jsx"), localStorage.getItem('token') == null ? false : true)()}>
          <Route path="category/list" element={LazyFn(() => import("@pages/admin/pages/category/Category.jsx"))()}></Route>
          <Route path="product/list" element={LazyFn(() => import("@pages/admin/pages/products/ProductList.jsx"))()}></Route>
        </Route>
        <Route path="/authen" element={LazyFn(() => import("@pages/authen/Authen.jsx"))()}></Route>
        <Route path="/email-confirm" element={LazyFn(() => import("@pages/authen/pages/EmailConfirm.jsx"))()}></Route>
        <Route path="/reset-password" element={LazyFn(() => import("@pages/authen/pages/ResetPassword.jsx"))()}></Route>
        <Route path="/manage-password" element={LazyFn(() => import("@pages/profile/components/ManagePassword.jsx"))()}></Route>
        <Route path="/set-ip" element={LazyFn(() => import("@pages/authen/pages/SetIP.jsx"))()}></Route>
      </Routes>
    </BrowserRouter>
  )
}
