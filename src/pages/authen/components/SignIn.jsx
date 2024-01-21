import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { message, Modal } from 'antd'
import api from '@apis'
import utils from '@utils'
import { loginWithGoogle, loginWithGithub, linkGithubWithGoogle, loginWithFacebook, linkFacebookWithGoogle } from '@/firebase.js'
import ResetPasswordForm from './ResetPasswordForm'
export default function SignIn() {
    const { t, i18n } = useTranslation();
    const [forgotPasswordForm, setForgotPasswordForm] = useState(false)

    async function handleLogin(e) {
        e.preventDefault();
        if(e.target.loginId.value.length == 0 || e.target.password.value.length == 0) {
            message.error("Xin nhập đủ thông tin đăng nhập")
            return
        }
        try {
            /*
                Input: userName / email + password => Search db.json ...
                Output: false => notication, true => token => save to local storage
            */
            let data = {
                loginId: e.target.loginId.value,
                password: e.target.password.value
            }

            /* Kiểm tra xem user có tồn tại hay chưa => có => data user, không => err */
            let userRes = await api.userApi.findByEmailOrUserName(data.loginId); // => array [], [user]
            if (userRes.status != 200) {
                throw "Lỗi không xác định"
            } else {
                if (userRes.data.length == 0) {
                    throw "Tên người dùng không tồn tại"
                }
            }
            let user = userRes.data[0];
            /*  Tìm thấy  => check password*/
            if (utils.hash.hashText(data.password) != user.password) {
                throw "Mật khẩu không chính xác"
            }

            /* Kiem tra IP login */
            let ipRes = await api.ipApi.getMyIp();
            let ip = ipRes.data.ip;

            if (!user.ipList.find(item => item == ip)) {
                let token = utils.token.createToken({
                    userId: user.id,
                    newIpList: [...user.ipList, ip],
                    time: Date.now()
                })

                api.mailApi.sendMail({
                    to: user.email,
                    subject: "Xác thực ip login mới. (Ya Miêu)",
                    content: `
                        <p>Chúng tôi nhận thấy bạn đang đăng nhập tại vị trí có IP là: ${ip}</p>
                        <p>Nếu thật sự là bạn, hãy bấm vào nút bên dưới để xác nhận và tiến hành đăng nhập lại.</p>
                        <a href="http://localhost:5173/set-ip?token=${token}">Add New Ip</a>
                    `
                })
                throw "Bạn đang đăng nhập ở một vị trí mới, vui lòng vào email xác thực!"
            }

            /* thanh cong */

            localStorage.setItem("token", utils.token.createToken(user))

            Modal.success({
                content: "Đăng nhập thành công",
                onOk: () => {
                    window.location.href = '/'
                }
            })
        } catch (err) {
            message.error(err)
        }
    }

    async function handleResetPassword(e) {
        try {
            e.preventDefault();
            let resetEmail = e.target.resetEmail.value;
            let userRes = await api.userApi.findByEmailOrUserName(resetEmail);
            let user = userRes.data[0];
            if (user) {
                let token = utils.token.createToken({
                    userId: user.id,
                    newPassword: utils.random.randomPassword(6),
                    resetEmail: e.target.resetEmail.value
                })
                api.mailApi.sendMail({
                    to: resetEmail,
                    subject: "Thông báo reset mật khẩu",
                    content: `
                                    <p>Có phải bạn vừa thông báo quên mật khẩu?</p>
                                    <p>Nếu đúng thì hãy nhấn vào link dưới đây để tiến hành đổi.</p>
                                    <a href="http://localhost:5173/reset-password?token=${token}">Reset</a>
                            `
                }).then(async (result) => {
                    console.log('result', result)
                    await message.success("Đã gửi email xác thực, vui lòng kiểm tra email!")
                }).catch((error) => {
                    console.log('error', error)
                })
            }
            else {
                alert('email không tồn tại trong hệ thống')
            }
            setForgotPasswordForm(false);
        } catch (error) {
            console.log("error", error)
        }
    }

    async function handleLoginWithFacebook() {
        try {
            let result = await loginWithFacebook();

            let userRes = await api.userApi.findByEmailOrUserName(result.user.email);
            console.log('userRes', userRes)
            if (userRes.status != 200) {
                throw t('err_200')
            } else {
                if (userRes.data.length == 0) {
                    let newUser = {
                        userName: String(Math.ceil(Date.now() * Math.random())),
                        email: result.user.providerData[0].email,
                        password: utils.hash.hashText(String(Math.ceil(Date.now() * Math.random()))),
                        emailConfirm: true,
                        role: "member",
                        status: "active",
                        createAt: String(Date.now()),
                        updateAt: String(Date.now()),
                        ipList: [],
                        avatar: result.user.photoURL,
                    }
                    let newUserRes = await api.userApi.register(newUser);
                    if (newUserRes.status != 201) {
                        throw t('err_200')
                    }
                    localStorage.setItem("token", utils.token.createToken(newUserRes.data))
                    Modal.success({
                        content: "login thanh cong",
                        onOk: () => {
                            window.location.href = '/'
                        }
                    })
                    return
                }
            }
            let user = userRes.data[0];
            localStorage.setItem("token", utils.token.createToken(user))
            Modal.success({
                content: "login thanh cong",
                onOk: () => {
                    window.location.href = '/'
                }
            })
        } catch (error) {
            
            if (error.code === "auth/account-exists-with-different-credential") {
                console.log("error", error)
                // Modal.confirm({
                //     content: "Tài khoản có địa chỉ email với trùng với phương thức đăng nhập Google. Bạn có muốn liên kết với tài khoản Google không?",
                //     onOk: async () => {
                //         try {
                //             let result = await linkFacebookWithGoogle();
                //             if (result) {
                //                 Modal.confirm({
                //                     content: "Liên kết thành công. Bạn có muốn đăng nhập bằng Google không?",
                //                     onOk: () => {
                //                         handleLoginWithGoogle()
                //                     },
                //                 })
                //             } else { message.error("Liên kết không thành công") }
                //         } catch (error) {
                //             console.log('error', error)
                //         }
                //     }
                // })
            }
        }
    }

    async function handleLoginWithGithub() {
        try {
            let result = await loginWithGithub();

            let userRes = await api.userApi.findByEmailOrUserName(result.user.email);
            if (userRes.status != 200) {
                throw t('err_200')
            } else {
                if (userRes.data.length == 0) {
                    let newUser = {
                        userName: String(Math.ceil(Date.now() * Math.random())),
                        email: result.user.providerData[0].email,
                        password: utils.hash.hashText(String(Math.ceil(Date.now() * Math.random()))),
                        emailConfirm: true,
                        role: "member",
                        status: "active",
                        createAt: String(Date.now()),
                        updateAt: String(Date.now()),
                        ipList: [],
                        avatar: result.user.photoURL,
                    }
                    let newUserRes = await api.userApi.register(newUser);
                    if (newUserRes.status != 201) {
                        throw t('err_200')
                    }
                    localStorage.setItem("token", utils.token.createToken(newUserRes.data))
                    Modal.success({
                        content: "login thanh cong",
                        onOk: () => {
                            window.location.href = '/'
                        }
                    })
                    return
                }
            }
            let user = userRes.data[0];
            localStorage.setItem("token", utils.token.createToken(user))
            Modal.success({
                content: "login thanh cong",
                onOk: () => {
                    window.location.href = '/'
                }
            })
        } catch (error) {
            if (error.code === "auth/account-exists-with-different-credential") {
                Modal.confirm({
                    content: "Tài khoản có địa chỉ email với trùng với phương thức đăng nhập Google. Bạn có muốn liên kết với tài khoản Google không?",
                    onOk: async () => {
                        try {
                            let result = await linkGithubWithGoogle();
                            if (result) {
                                Modal.confirm({
                                    content: "Liên kết thành công. Bạn có muốn đăng nhập bằng Google không?",
                                    onOk: () => {
                                        handleLoginWithGoogle()
                                    },
                                })
                            } else { message.error("Liên kết không thành công") }
                        } catch (error) {
                            console.log('error', error)
                        }
                    },
                })
            }
        }
    }

    async function handleLoginWithGoogle() {
        try {
            let result = await loginWithGoogle();

            let userRes = await api.userApi.findByEmailOrUserName(result.user.email); // => array [], [user]
            if (userRes.status != 200) {
                throw t('err_200')
            } else {
                if (userRes.data.length == 0) {
                    let newUser = {
                        userName: String(Math.ceil(Date.now() * Math.random())),
                        email: result.user.email,
                        password: utils.hash.hashText(String(Math.ceil(Date.now() * Math.random()))),
                        emailConfirm: true,
                        role: "member",
                        status: "active",
                        createAt: String(Date.now()),
                        updateAt: String(Date.now()),
                        ipList: [],
                        avatar: result.user.photoURL
                    }
                    let newUserRes = await api.userApi.register(newUser);
                    if (newUserRes.status != 201) {
                        throw t('err_200')
                    }
                    localStorage.setItem("token", utils.token.createToken(newUserRes.data))
                    Modal.success({
                        content: t('signIn_success'),
                        onOk: () => {
                            window.location.href = '/'
                        }
                    })
                    return
                }
            }
            // da ton tai trong he thong
            let user = userRes.data[0];
            localStorage.setItem("token", utils.token.createToken(user))
            Modal.success({
                content: t('signIn_success'),
                onOk: () => {
                    window.location.href = '/'
                }
            })
        } catch (err) {
            alert(t('err_200'))
        }
    }

    return (
        <div className="form-container sign-in-container">
            {
                forgotPasswordForm && <ResetPasswordForm handleResetPassword={handleResetPassword} setForgotPasswordForm={setForgotPasswordForm} />
            }
            <form onSubmit={async (e) => {
                e.target.querySelector(".divLoading").style.display = "block";
                await handleLogin(e)
                e.target.querySelector(".divLoading").style.display = "none";
            }}>
                <h1>Đăng nhập</h1>
                <div className="social-container">
                    <a onClick={async () => {
                        document.querySelector(".divLoading").style.display = "block";
                        await handleLoginWithFacebook()
                        document.querySelector(".divLoading").style.display = "none";
                    }}className="social">
                        <i className="fab fa-facebook-f" />
                    </a>
                    <a onClick={async () => {
                        document.querySelector(".divLoading").style.display = "block";
                        await handleLoginWithGoogle()
                        document.querySelector(".divLoading").style.display = "none";
                    }} className="social">
                        <i className="fab fa-google" />
                    </a>
                    <a onClick={async () => {
                        document.querySelector(".divLoading").style.display = "block";
                        await handleLoginWithGithub()
                        document.querySelector(".divLoading").style.display = "none";
                    }} className="social">
                        <i className="fab fa-github" />
                    </a>
                </div>
                <span>Đăng nhập bằng tài khoản đã có</span>
                <input type="text" placeholder="username/email" name='loginId' />
                <input type="password" placeholder="password" name='password'/>
                <div className='forgot-password' style={{ color: "black", cursor: "pointer" }} onClick={() => {
                    setForgotPasswordForm(true)
                }}>Quên mật khẩu?</div>
                <button className='btnLogin' type='submit'>Đăng nhập
                        <div className='divLoading'>
                            <span className='loader'></span>
                        </div>
                </button>
            </form>
        </div>
    )
}
