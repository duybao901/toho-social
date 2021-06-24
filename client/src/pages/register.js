import React from 'react'

function Register() {
    return (
        <div>
            <div className='register__container'>
                <div className="register__left">
                    <img src="https://abs.twimg.com/sticky/illustrations/lohp_en_1302x955.png" alt='a'>
                    </img>
                </div>
                <div className="register__right">
                    {/* <img src="https://res.cloudinary.com/dxnfxl89q/image/upload/v1624525522/Toho/logo_t2dvwn.png" alt='a'></img> */}
                    <h1>register Now</h1>
                    <h2>Join Toho today.</h2>
                    <form className='register__form'>
                        <div>
                            <div className='form__input register__form-input'>
                                <label htmlFor='email'>Email</label>
                                <div>
                                    <input type='text' id='email' name='email'></input>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className='form__input register__form-input'>
                                <label htmlFor='password'>Password</label>
                                <div>
                                    <input type='text' id='email' name='email'></input>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="register__bottom">

                </div>
            </div>
        </div>
    )
}

export default Register
