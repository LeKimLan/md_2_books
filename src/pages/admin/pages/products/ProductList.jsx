import React, {useEffect, useState} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Table } from 'react-bootstrap';
import ProductCreate from './components/ProductCreate';
import ProductUpdate from './components/ProductUpdate';
import { productAction } from '@slices/product.slice'
import { useNavigate } from 'react-router-dom';
import api from '@services/apis'

export default function Product() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const productStore = useSelector(store => store.productStore)
  const categoryStore = useSelector(store => store.categoryStore)
  const [updateProduct, setUpdateProduct] = useState({})


  function getCategory(categoryId) {
    return categoryStore.data?.find(item => item.id == categoryId)
  }

  return (
    <>
      {
        productStore.createModalState && <ProductCreate categoryStore={categoryStore} />
      }
      {
        productStore.updateModalState && <ProductUpdate categoryStore={categoryStore} updateProduct={updateProduct}/>
      }
      <h1>Product</h1>
      <div className='product_site'>
        {
          productStore?.data?.map((item, id) => {
            return (
              <div key={Date.now() * Math.random()} className='product_box'>
                <div onClick={() => {
                  navigate(`/${item.title + '-' + item.id}`)
                }}>
                  <div>
                    <img className='product_img' src={item.avatar} />
                  </div>
                  <div>
                    {item.title}
                  </div>
                </div>
                <button onClick={() => {
                  setUpdateProduct(item)
                  dispatch(productAction.changeStateUpdateModal())
                }}>Chỉnh sửa</button>
              </div>
            )
          })
        }
      </div>

      {/* <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Avatar</th>
            <th>Des</th>
            <th>Status</th>
            <th>Tools</th>
          </tr>
        </thead>
        <tbody>
          {
            productStore.data?.map((product, index) => {
              return (
                <tr key={Date.now() * Math.random()}>
                  <td>{index + 1}</td>
                  <td>{product.name}</td>
                  <td>{getCategory(product.categoryId).title}</td>
                  <td>{product.price}</td>
                  <td>
                    <img src={product.avatar} style={{ width: "50px", height: "50px", borderRadius: "50%" }} />
                  </td>
                  <td>
                    <button className='btn btn-primary'>show</button>
                  </td>
                  <td>{product.status ? "dang ban" : "dung ban"}</td>
                  <td>
                    <button className='btn btn-danger'>Delete</button>
                    <button className='btn btn-warning'>Update</button>
                  </td>
                </tr>
              )
            })
          }
        </tbody>
      </Table> */}
    </>
  )
}
