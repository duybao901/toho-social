import React from 'react'
import LeftSide from '../../components/message/LeftSide'
import RightSide from '../../components/message/RightSide'

const Convertion = () => {
    return (
        <div className="main__container-right">
            <div className="message__row message__right-have-id">
                <LeftSide />
                <RightSide />
            </div>
        </div>
    )
}

export default Convertion
