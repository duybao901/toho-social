import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import MessageDisplay from './MessageDisplay'
function RightSide() {

    const { id } = useParams();
    const [user, setUser] = useState({});
    const [text, setText] = useState('');
    const { auth, message } = useSelector(state => state);
    useEffect(() => {
        const newUser = message.users.find(user => user._id === id);
        if (newUser) {
            setUser(newUser);
        }
    }, [message.users, id])


    function onSubmit(e) {
        e.preventDefault();
    }
    function hanldeChange(e) {
        setText(e.target.value)
    }

    return (
        <div className="message__right-chat">
            <div className="message__box">
                <div className="message__box-header">
                    <img style={{ width: '40px' }} src={user.avatar} alt="user_avatar">
                    </img>
                    <div className="search__users-infor">
                        <span style={{ fontSize: '14px', fontWeight: "700" }}>{user.fullname}</span>
                        <span style={{ fontSize: '14px', fontWeight: "400" }}>@{user.username}</span>
                    </div>
                </div>
                <div className="chat__container">
                    <div className="chat_display">
                        <div className="chat_row orther_message">
                            <MessageDisplay user={user} />
                        </div>

                        <div className="chat_row you_message">
                            <MessageDisplay user={auth.user} />
                        </div>

                    </div>
                </div>
                <form className="chat_input" onSubmit={onSubmit}>
                    <input id='text' type="text"
                        name="text"
                        placeholder="Enter your message..."
                        value={text}
                        onChange={hanldeChange}
                    ></input>
                    <button type="submit" disabled={text ? false : true}>
                        <i className='bx bx-send' style={{ opacity: text ? "1" : '0.2' }}></i>
                    </button>
                </form>
            </div>
        </div>
    )
}

export default RightSide
