import React from 'react'
import moment from 'moment'

function MessageDisplay({ user, msg }) {

    return (
        <div className="message_display">
            <div className="message_content">
                <div className='chat_user'>
                    <img src={user.avatar} alt="chat_user"></img>
                    <span>{user.username}</span>
                </div>

                {
                    msg.text && <div className="chat_text">
                        <p>
                            {msg.text}
                        </p>
                    </div>
                }
                {
                    msg.media && msg.media.map((img, index) => {
                        return img.url.match(/video/i) ?
                            <video key={index} className="chat_media" src={img.url} controls alt="chat_message"></video>
                            : <img key={index} className="chat_media" src={img.url} alt="chat_message"></img>
                    })
                }

                <span className="chat_date">{moment(msg.createdAt).format('MMMM Do YYYY, h:mm:ss')}</span>
            </div>
        </div>
    )
}

export default MessageDisplay
