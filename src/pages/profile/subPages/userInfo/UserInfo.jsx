import React, { useEffect, useState } from 'react'
import './userInfo.scss'
import { useSelector } from 'react-redux'
import utils from '@utils'
import apis from '@apis'
import { Input, Modal, message } from 'antd'
import { uploadToFirebase } from '@/firebase'
import { useDispatch } from 'react-redux'
import { userAction } from '@slices/user.slice'
import ManagePasswordForm from '../../components/ManagePasswordForm'

export default function UserInfo() {
  const userStore = useSelector(store => store.userStore)
  const [user, setUser] = useState(utils.token.decodeToken(localStorage.getItem("token")))
  const [editField, setEditField] = useState(false)
  const [editForm, setEditForm] = useState(false)
  const [editItem, setEditItem] = useState()
  const dispatch = useDispatch();


  async function handleDeleteIP(item) {
    let currentIP = await apis.ipApi.getMyIp()
    if (currentIP.data.ip == item) {
      Modal.error({
        content: 'Bạn không thể xóa IP hiện đang dùng',
      })
      return
    } else {
      let newIpList = user.ipList.filter(ip => ip != item)
      let newUserData = {
        ...user,
        ipList: newIpList,
        updateAt: String(Date.now())
      }
      await apis.userApi.update(user.id, newUserData)
      setUser(newUserData)
      dispatch(userAction.setData(newUserData))
      localStorage.setItem("token", utils.token.createToken(newUserData))
      message.success("Xóa thành công")
    }
  }

  async function handleGetItem(item) {
    let currentItem = await apis.ipApi.getMyIp()
    if (currentItem.data.ip == item) {
      Modal.error({
        content: 'Bạn không thể thay đổi IP hiện đang dùng',
      })
      return
    } else {
      if (editField == false) {
        setEditField(true)
      } else {
        setEditField(false)
      }
    }

  }

  async function handleEditIP(item) {
    let currentIP = await apis.ipApi.getMyIp()
    if (currentIP.data.ip == item) {
      Modal.error({
        content: 'Bạn không thể thay đổi IP hiện đang dùng',
      })
      return
    } else {
      let newIP = document.querySelector('.edit_ID_field').value
      for (let i = 0; i < user.ipList.length; i++) {
        if (item == user.ipList[i]) {
          user.ipList[i] = newIP
          let newUserData = {
            ...user,
            ipList: user.ipList,
            updateAt: String(Date.now())
          }
          await apis.userApi.update(user.id, newUserData)
          setUser(newUserData)
          dispatch(userAction.setData(newUserData))
          setEditField(false)
          localStorage.setItem("token", utils.token.createToken(newUserData))
        }
      }
    }
    setEditField(false)
  }

  async function handleEditAvatar(item) {
    let newUserData = {
      ...user,
      avatar: item,
      updateAt: String(Date.now())
    }
    await apis.userApi.update(user.id, newUserData)
    setUser(newUserData)
    dispatch(userAction.setData(newUserData))
    localStorage.setItem("token", utils.token.createToken(newUserData))
  }

  async function handleEditName(item) {
    let newUserData = {
      ...user,
      userName: item,
      updateAt: String(Date.now())
    }
    await apis.userApi.update(user.id, newUserData)
    setUser(newUserData)
    dispatch(userAction.setData(newUserData))
    setEditField(false)
    localStorage.setItem("token", utils.token.createToken(newUserData))
  }

  async function handleEditEmail(item) {
    let newUserData = {
      ...user,
      email: item,
      updateAt: String(Date.now())
    }
    await apis.userApi.update(user.id, newUserData)
    setUser(newUserData)
    dispatch(userAction.setData(newUserData))
    setEditField(false)
    message.success("Thay đổi email thành công")
    localStorage.setItem("token", utils.token.createToken(newUserData))
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    let data = utils.token.decodeToken(localStorage.getItem('token'))
    let oldPassword = e.target.old_password.value;

    if (utils.hash.hashText(oldPassword) != data.password) {
      message.error('Vui lòng nhập đúng mật khẩu cũ')
    } else if (e.target.new_password.value == oldPassword) {
      message.error('Mật khẩu mới không được trùng mật khẩu cũ')
    } else if (e.target.new_password.value != e.target.confirm_new_password.value) {
      message.error('nhập đúng mật khẩu xác nhận')
    } else {
      let newUserData = {
        ...data,
        password: utils.hash.hashText(e.target.new_password.value),
        updateAt: String(Date.now())
      }
    //   let token = utils.token.createToken({
    //     ...data,
    //     password: utils.hash.hashText(e.target.new_password.value),
    //     updateAt: String(Date.now())
    // })
      // apis.mailApi.sendMail({
      //   to: user.email,
      //   subject: "Thông báo thay đổi mật khẩu",
      //   content: `
      //                   <p>Có phải bạn vừa thông báo thay đổi mật khẩu?</p>
      //                   <p>Nếu đúng thì hãy nhấn vào link dưới đây để tiến hành đổi.</p>
      //                   <a href="http://localhost:5173/manage-password?token=${token}">Đổi</a>
      //           `
      // }).then(async (result) => {
      //   console.log('result', result)
      //   await message.success("Đã gửi email xác thực, vui lòng kiểm tra email!")
      // }).catch((error) => {
      //   console.log('error', error)
      // })
      // setEditForm(false)
      await apis.userApi.update(newUserData.id, newUserData)
        .then(result => {
          document.querySelector('form').reset();
          setEditForm(false)
          // dispatch(userAction.setData(newUserData))
          localStorage.removeItem("token")
          message.success('Cập nhật mật khẩu thành công, vui lòng đăng nhập lại với mật khẩu mới')
          setTimeout(() => {
            window.location.href = '/authen'
          }, 3000);
        })
        .catch((err) => {
          console.log('err', err)
        })
    }
  }

  function showIPList(e) {
    let targetElTable = e.target.parentNode.querySelector('.table')
    if (targetElTable.classList.length > 1) {
      targetElTable.classList.remove("hidden")
    } else {
      targetElTable.classList.add("hidden")
    }
  }

  return (
    <div className='user_info'>
      <h2>User Info</h2>
      <div>
        <div className='user_avatar'>
          <img src={user.avatar} />
          <input type="file" name='avatar' id='avatar' className='hidden' onChange={async (e) => {
            if (e.target.files.length != 0) {
              e.target.parentNode.querySelector("img").src = URL.createObjectURL(e.target.files[0])
              let result = await uploadToFirebase(e.target.files[0])
              handleEditAvatar(result)
            }
          }} />
          <label htmlFor="avatar">Thay ảnh</label>
        </div>
        <div className='user_name'>
          {
            editField == true && editItem == user.userName ? <span>
              Tên người dùng : <input type="text" defaultValue={user.userName} className='edit_name_field' name='edit_name' />
              <button onClick={() => {
                handleGetItem(user.userName)
              }}>Ngưng</button>
              <button onClick={() => {
                let newName = document.querySelector('.edit_name_field').value
                handleEditName(newName)
              }}>Lưu</button>
            </span> :
              <span>
                Tên người dùng: {user.userName} <button onClick={() => {
                  handleGetItem(user.userName)
                  setEditItem(user.userName)
                }}>Thay đổi</button>
              </span>
          }
        </div>
        <div className='user_email'>
          {
            editField == true && editItem == user.email ? <span>
              Email: <input type="text" defaultValue={user.email} className='edit_email_field' name='edit_email' />
              <button onClick={() => {
                handleGetItem()
              }}>Ngưng</button>
              <button onClick={() => {
                let newName = document.querySelector('.edit_email_field').value
                handleEditEmail(newName)
              }}>Lưu</button>
            </span> :
              <span>
                Email: {user.email} <button onClick={() => {
                  handleGetItem(user.email)
                  setEditItem(user.email)
                }}>Thay đổi</button>
              </span>
          }
        </div>
        <button onClick={() => {
          if (editForm == false) {
            setEditForm(true)
          } else {
            setEditForm(false)
          }
        }}>Đổi mật khẩu </button>
        {
          editForm && <ManagePasswordForm handleChangePassword={handleChangePassword} setEditForm={setEditForm} />
        }
        <div className='ip_list'>
          {
            <button onClick={(e) => {
              showIPList(e)
            }}>Danh sách IP</button>
          }
          <div className='table hidden'>
            <table>
              <thead>
                <tr>
                  <th className='order'>#</th>
                  <th className='ip_address'>địa chỉ IP</th>
                  <th className='tools'>Công cụ</th>
                </tr>
              </thead>
            </table>
            <div className='table_body'>
              <table>
                <tbody >
                  {
                    user.ipList?.map((item, index) => (
                      <tr key={Date.now() * Math.random()}>
                        <td className='order'>{index + 1}</td>
                        <td className='ip_address'>
                          {
                            editField == true && editItem == item ? <input type="text" defaultValue={item} className='edit_ID_field' name='edit_ID' /> : <span>{item}</span>
                          }
                        </td>
                        <td className='tools'>
                          {
                            editField == true && editItem == item ?
                              <div>
                                <button onClick={() => {
                                  handleGetItem(item)
                                }}>Ngưng</button>
                                <button onClick={() => {
                                  handleEditIP(item)
                                }}>Lưu</button>
                              </div>
                              :
                              <div>
                                <button onClick={() => {
                                  handleDeleteIP(item)
                                }}>Xóa</button>
                                <button onClick={() => {
                                  handleGetItem(item)
                                  setEditItem(item)
                                }}>Chỉnh sửa</button>
                              </div>
                          }
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
