import React from 'react'

function MessageDisplay({ user }) {

    return (
        <div className="message_display">
            <div className='chat_user'>
                <img src={user.avatar} alt="chat_user"></img>
                <span>{user.username}</span>
            </div>

            <div className="chat_text">
                <p>
                    There are many variations of passages of Lorem Ipsum available,
                    but the majority have suffered alteration in some form,
                    by injected humour, or randomised words which don't look even slightly believable.
                    If you are going to use a passage of Lorem Ipsum,
                    you need to be sure there isn't anything embarrassing hidden
                    in the middle of text
                </p>
            </div>

            <span className="chat_date">April 2021</span>
        </div>
    )
}

export default MessageDisplay
