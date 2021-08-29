import React from 'react'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import { deleteMessages } from '../../redux/actions/messageAction'
import CallTime from './CallTime'
function MessageDisplay({ user, msg, data }) {
    const dispatch = useDispatch();
    const { auth } = useSelector(state => state);

    function handleDeleteMessages() {
        if (window.confirm("Do you want to remove this message?")) {
            dispatch(deleteMessages({ msg, auth, data }));
        }
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
                    {
                        msg.call && <div className="chat__call">
                            {
                                msg.call.times === 0 ?
                                    msg.call.video ?
                                        <div className="chat__call-container">
                                            <i className='bx bxs-video-off'></i>
                                            <div className="chat__call-text">
                                                <span>
                                                    Video Call
                                                </span>
                                                <span className="chat__call-times">
                                                    {moment(msg.call.createdAt).format('YYYY/MM/DD')}
                                                </span>
                                            </div>
                                        </div>
                                        :
                                        <div className="chat__call-container">
                                            <i className='bx bxs-phone-off'></i>
                                            <div className="chat__call-text">
                                                <span>
                                                    Audio Call
                                                </span>
                                                <span className="chat__call-times">
                                                    {moment(msg.call.createdAt).format('YYYY/MM/DD')}
                                                </span>
                                            </div>
                                        </div>
                                    :
                                    msg.call.video ?
                                        <div className="chat__call-container">
                                            <i className='bx bxs-video-recording orther__call-audio' ></i>
                                            <div className="chat__call-text">
                                                <span>
                                                    Video Call
                                                </span>
                                                <span className="chat__call-times">
                                                    <CallTime times={msg.call.times} />
                                                </span>
                                            </div>
                                        </div>
                                        :
                                        <div className="chat__call-container">
                                            <i className='bx bxs-phone orther__call-audio'></i>
                                            <div className="chat__call-text">
                                                <span>
                                                    Audio Call
                                                </span>
                                                <span className="chat__call-times">
                                                    <CallTime times={msg.call.times} />
                                                </span>
                                            </div>
                                        </div>
                            }
                        </div>

                    }
                </div>

                <span className="chat_date">{moment(msg.createdAt).format('YYYY-MM-DD, h:mm:ss')}</span>
            </div>
        </div>
    )
}

export default MessageDisplay
