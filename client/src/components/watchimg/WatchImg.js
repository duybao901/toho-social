import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

function WatchImg() {
    const dispatch = useDispatch();
    const { show, img } = useSelector(state => state.display);

    function closeDisplay() {
        dispatch({ type: "SHOW", payload: {} });
    }
    return show ? <div className="watch__img">
        <div className="watch__img-container">
            <div className="watch__img-close" onClick={closeDisplay}>
                <i className='bx bx-x'></i>
            </div>
            <div className='watch__img-close-op' onClick={closeDisplay}>

            </div>
            <div className="watch__img-item">
                <img src={img} alt="user-avatar"></img>
            </div>
        </div>
    </div > : ""
}

export default WatchImg
