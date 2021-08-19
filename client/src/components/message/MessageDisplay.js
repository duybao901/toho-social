import React from 'react'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import { deleteMessages } from '../../redux/actions/messageAction'
function MessageDisplay({ user, msg, data }) {
    const dispatch = useDispatch();
    const { auth } = useSelector(state => state);

    function handleDeleteMessages() {
        dispatch(deleteMessages({ msg, auth, data }));
    }

    return (
        <div className="message_display">
            <div className="message_content">
                <div className='chat_user'>
                    <img src={user.avatar} alt="chat_user"></img>
                    <span>{user.username}</span>
                </div>

                <div className="chat__content">
                    {
                        msg.sender === auth.user._id && <i className='bx bxs-trash chat__delete-icon' onClick={handleDeleteMessages}></i>
                    }
                    {
                        msg.text && <div className="chat_text">
                            <p>
                                {msg.text}
                            </p>
                        </div>
                    }
                    {
                        msg.media && msg.media.map((img, index) => {
                            return img.url && img.url.match(/video/i) ?
                                <video key={index} className="chat_media" src={img.url} controls alt="chat_message"></video>
                                : <img key={index} className="chat_media" src={img.url} alt="chat_message"></img>
                        })
                    }
                </div>

                <span className="chat_date">{moment(msg.createdAt).format('YYYY-MM-DD, h:mm:ss')}</span>
            </div>
        </div>
    )
}

export default MessageDisplay
