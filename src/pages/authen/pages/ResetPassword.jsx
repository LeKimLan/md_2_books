import React, { useEffect } from 'react'
import utils from '@utils'
import { Modal } from 'antd';
import api from '@services/apis'

export default function ResetPassword() {

  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  let data = utils.token.decodeToken(token.replaceAll(" ", "+"));
  console.log("data", data)
  useEffect(() => {
    try {
      if (data) {
        api.userApi.update(data.userId, {
          password: utils.hash.hashText(data.newPassword)
        })
      }

      api.mailApi.sendMail({
        to: data.resetEmail,
        subject: "Reset mật khẩu thành công",
        content: `
                      <p>Mật khẩu mới của bạn là   <b>${data.newPassword}</b></p>
                      <a href="http://localhost:5173/authen">Trở về đăng nhập</a>
                `
      })
        .then(res => {
          console.log("res", res)
          Modal.success({
            title: "Kiểm tra lại email để lấy mật khẩu mới!"
          })
        })
    } catch (error) {
      console.log('error', error)
    }
  }, [])

  return (
    <div style={{ color: "black" }}></div>
  )
}
