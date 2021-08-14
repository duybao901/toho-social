import React from 'react'
import { Link, useParams } from 'react-router-dom'

function UserCardMessage({ user }) {

    const { id } = useParams();
    function isActive(user) {
        return (user._id === id) ? "active" : ""
    }

    return (
        <Link key={user._id} className={`user_message ${isActive(user)}`} to={`/message/${user._id}`}>
            <img style={{ width: '40px' }} src={user.avatar} alt="user_avatar">
            </img>
            <div className="search__users-infor" style={{ marginLeft: "5px" }}>
                <div style={{ fontSize: '14px', fontWeight: "700" }}>{user.username}</div>
                {
                    user.text || user.media ?
                        <div style={{ fontSize: '14px', fontWeight: "400" }}>
                            {user.text.length > 20 ? user.text.slice(0, 20) + "..." : user.text}
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                {
                                    user.media.length > 0 && "+"+user.media.length
                                }
                                {

                                    user.media.length > 0 && <i className='bx bx-image-alt' style={{ fontSize: "1.6rem", color: "#1DA1F2" }}></i>
                                }
                            </div>
                        </div>

                        :
                        <div style={{ fontSize: '14px', fontWeight: "400" }}>{user.fullname}</div>
                }
            </div>
            <i className='bx bxs-circle'></i>
        </Link >
    )
}

export default UserCardMessage
