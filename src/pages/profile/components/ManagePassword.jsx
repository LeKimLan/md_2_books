import React, { useEffect } from 'react'
import utils from '@utils'
import { Modal } from 'antd';
import apis from '@services/apis'
import { userAction } from '@slices/user.slice'

export default function ManagePassword() {

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    let data = utils.token.decodeToken(token.replaceAll(" ", "+"));
    console.log("data", data)
    useEffect(() => {
        try {
            if (data) {
                apis.userApi.update(data.id, data)
                    .then((result) => {
                        document.querySelector('form').reset();
                        setUser(data)
                        dispatch(userAction.setData(data))
                        localStorage.setItem("token", utils.token.createToken(data))
                        message.success('Cập nhật mật khẩu thành công, vui lòng đăng nhập lại với mật khẩu mới')
                        setTimeout(() => {
                            location.href = '/authen'
                        }, 3000);
                    })
                    .catch((err) => {
                        console.log('err', err)
                    })
            }
            // apis.mailApi.sendMail({
            //     to: data.resetEmail,
            //     subject: "Thay đổi mật khẩu thành công",
            //     content: `
            //           <p>Mật khẩu của bạn đã được thay đổi, hãy đăng nhập lại với mật khẩu mới</b></p>
            //           <a href="http://localhost:5173/authen">Trở về đăng nhập</a>
            //     `
            // })
            //     .then(res => {
            //         // console.log("res", res)
            //         // Modal.success({
            //         //     title: "Kiểm tra lại email để lấy mật khẩu mới!"
            //         // })
            //     })
        } catch (error) {
            console.log('error', error)
        }
    }, [])

    return (
        <div style={{ color: "black" }}></div>
    )
}
