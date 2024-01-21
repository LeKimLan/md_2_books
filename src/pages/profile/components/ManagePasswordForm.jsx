import React from 'react'

export default function ManagePasswordForm({handleChangePassword, setEditForm}) {
    return (
        <div>
            <form onSubmit={(e) => {
                handleChangePassword(e)
            }}>
                <h3>Mời nhập mật khẩu cũ</h3>
                <input type="password" name="old_password" />
                <br />
                <p>Mời nhập mật khẩu mới</p>
                <input type="password" name="new_password" />
                <p>Mời xác nhận lại mật khẩu mới</p>
                <input type="password" name="confirm_new_password" />
                <br />
                <button type='submit'>Xác nhận đổi</button>
                <button type='button' onClick={() => {
                    setEditForm(false)
                }}>Ngưng</button>
            </form>
        </div>
    )
}
