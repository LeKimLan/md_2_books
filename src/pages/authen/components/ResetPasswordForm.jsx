import React from 'react'

export default function ResetPasswordForm({ handleResetPassword, setForgotPasswordForm }) {

    return (
        <div className='reset-password-comp'>
                        <form className='reset-password-form' onSubmit={(e) => {
                            handleResetPassword(e)
                        }}>
                            <button id='close_form' type='button' onClick={() => {
                                setForgotPasswordForm(false)
                            }}>X</button>
                            <p>Please enter your email</p>
                            <input type="text" name='resetEmail' placeholder="email" />
                            <button className='reset_button' type='submit' >
                                Reset
                            </button>
                        </form>
                    </div>
    )
}
