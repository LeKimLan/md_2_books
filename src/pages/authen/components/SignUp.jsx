import React from 'react'
import {message, Modal} from 'antd'
import { useTranslation } from 'react-i18next'
import api from '@apis'
import utils from '@utils'

export default function SignUp({containerRef}) {
    const { t, i18n} = useTranslation();

    async function handleRegister(e) {
        e.preventDefault();
        try {
            let ipRes = await api.ipApi.getMyIp();
            let newUser = {
                userName: e.target.userName.value,
                email: e.target.email.value,
                password: utils.hash.hashText(e.target.password.value),
                emailConfirm: false,
                role: "member",
                status: "active",
                createAt: String(Date.now()),
                updateAt: String(Date.now()),
                ipList: [
                    ipRes.data.ip
                ],
                avatar: "https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg"
            }

            let emailExist = await api.userApi.findByEmailOrUserName(e.target.email.value);
            if(emailExist.status != 200) {
                throw 'Lỗi không xác định'
            }else {
                if(emailExist.data.length > 0) {
                    throw 'Địa chỉ email đã tồn tại'
                }
            }

            let userExist = await api.userApi.findByEmailOrUserName(e.target.userName.value);
            if(userExist.status != 200) {
                throw 'Lỗi không xác định'
            }else {
                if(userExist.data.length > 0) {
                    throw 'Tên đăng nhập đã tồn tại'
                }
            }

            let userRes = await api.userApi.register(newUser);
            if(userRes.status != 201) {
                throw 'Lỗi không xác định'
            }



            let token = utils.token.createToken({
                userId:  userRes.data.id,
                time: Date.now()
            })
            // let tokenData = utils.token.decodeToken(token)
            /* Thanh Cong */
            api.mailApi.sendMail({
                to: newUser.email,
                subject: "Xác thực email đăng ký tài khoản mới.",
                content: `
                    <a href="http://localhost:5173/email-confirm?token=${token}">Xác thực</a>
                `
            }).then(res => {
                console.log('res', res)
            })
            Modal.confirm({
                title: "Đăng ký thành công",
                content: "Bạn có muốn đăng nhập ngay bây giờ không?",
                okType: "primary",
                cancelText: "Không",
                okText: "Có",
                onOk: () => {
                    containerRef.current.classList.remove("right-panel-active"); 
                }
            })
        }catch(err) {
            message.error(err)
        }
    }
    return (
        <div className="form-container sign-up-container">
            <form onSubmit={(e) => {
                handleRegister(e);
            }}>
                <h1>Tạo tài khoản</h1>
                <div className="social-container">
                    <a href="#" className="social">
                        <i className="fab fa-facebook-f" />
                    </a>
                    <a href="#" className="social">
                        <i className="fab fa-google-plus-g" />
                    </a>
                    <a href="#" className="social">
                        <i className="fab fa-linkedin-in" />
                    </a>
                </div>
                <span>hoặc sử dụng email để đăng ký</span>
                <input type="text" name='userName' placeholder="User Name" />
                <input type="email" name='email' placeholder="Email" />
                <input type="password" name='password' placeholder="Password" />
                <button type='submit'>Signup</button>
            </form>
        </div>
    )
}
