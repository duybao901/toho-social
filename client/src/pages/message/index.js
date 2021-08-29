import React from 'react'
import LeftSide from '../../components/message/LeftSide'
import MessageImg from '../../images/messenger.png'

function Message() {
    return (
        <div className="main__container-right">
            <div className="message__row left__meesage">
                <LeftSide />
                <div className="message__right">
                    <div className="message__right-container">
                        <h2>You don’t have a message selected</h2>
                        <p>Choose one from your existing messages, or start a new one.</p>
                        <img src={MessageImg} alt="image__message"></img>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Message
