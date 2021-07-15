import React from 'react'
import * as TYPES from '../../redux/constants/index'
import { useDispatch } from 'react-redux'
function Alert({ msg }) {
    const dispatch = useDispatch();

    function clodeAlert() {
        dispatch({ type: TYPES.NOTIFY, payload: {} })
    }

    return (

        <div className='alert__message'>
            <div className={`alert__box ${msg.type}`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 className="alert__box-title">
                        {msg.title}
                    </h2>
                    <span onClick={clodeAlert}>&times;</span>
                </div>
                <p className="alert__box-body">
                    {msg.body}
                </p>
            </div>
        </div>
    )
}

export default Alert
