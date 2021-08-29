import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../../redux/actions/authAction'

import StatusModal from '../StatusModal'
import * as POST_TYPES from '../../redux/constants/post'

const menuList = [
    {
        path: "/",
        text: "home",
        icon: "bx bx-home-circle",
        iconActive: "bx bxs-home-circle",
    },
    {
        path: "/explore",
        text: "explore",
        icon: "bx bx-hash",
        iconActive: "bx bx-hash",
    },
    {
        path: "/notifications",
        text: "notifications",
        icon: "bx bx-bell",
        iconActive: "bx bxs-bell",
    },
    {
        path: "/message",
        text: "message",
        icon: "bx bx-comment-detail",
        iconActive: "bx bxs-comment-detail",
    },

]

function Menu() {
    const location = useLocation();
    const { auth, notification } = useSelector(state => state)
    const [openStatus, setOpenStatus] = useState(false);
    const dispatch = useDispatch();

    function isActive(path) {
        if (location.pathname === path) {
            return 'active'
        }
    }

    function handleLogout() {
        dispatch(logout());
    }

    function hanldeOpenStatus() {
        setOpenStatus(true);
    }

    function handleCloseStatus() {
        setOpenStatus(false);
        dispatch({ type: POST_TYPES.STATUS, payload: { onEdit: false } })
    }

    return (
        <div className='menu'>
            <ul className="menu__list">
                {
                    menuList.map((menu, index) => {
                        return <li className={`menu__list-item ${isActive(menu.path)}`} key={index}>
                            <Link to={menu.path}>
                                <div className={menu.text === "notifications" ? "menu__notifications" : ""}>
                                    <i className={isActive(menu.path) ? menu.iconActive : menu.icon}></i>
                                    {
                                        menu.text === "notifications" && notification.data.length > 0 && <span className="menu__notifications-badge">
                                            {notification.data.length}
                                        </span>
                                    }
                                </div>
                                <span>
                                    {menu.text}
                                </span>
                            </Link>
                        </li>
                    })
                }
                <li className={`menu__list-item ${isActive(`/profile/${auth.user._id}`)}`}>
                    <Link to={`/profile/${auth.user._id}`}>
                        <i className={!isActive(`/profile/${auth.user._id}`) ? "bx bx-user" : "bx bxs-user"}></i>
                        <span>
                            profile
                        </span>
                    </Link>
                </li>
                <li className='menu__list-item menu__list-item--btn'>
                    <span className="menu__list-post-btn" onClick={hanldeOpenStatus}>
                        <i className='bx bxs-edit-alt'></i>
                        <span>
                            Post
                        </span>
                    </span>
                    <StatusModal open={openStatus} setOpenStatus={setOpenStatus} handleClose={handleCloseStatus} />
                </li>

            </ul>

            <div className='menu__dropdown' role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <img src={auth.user && auth.user.avatar} alt='useravatar'>
                </img>
                <div className="menu__dropdown-infor">
                    <span style={{ fontSize: '14px' }}>{auth.user && auth.user.fullname}</span>
                    <span style={{ fontSize: '14px', fontWeight: "400" }}>@{auth.user && auth.user.username}</span>
                </div>
                <i className='bx bx-dots-horizontal-rounded'></i>
            </div>
            <div className="dropdown-menu menu__dropdown-box" aria-labelledby="dropdownMenuLink">
                <div className="menu__dropdown-box-item" >
                    <img src={auth.user && auth.user.avatar} alt='useravatar'>
                    </img>
                    <div className="menu__dropdown-infor">
                        <span style={{ fontSize: '14px', fontWeight: "700" }}>{auth.user && auth.user.fullname}</span>
                        <span style={{ fontSize: '14px', fontWeight: "400" }}>@{auth.user && auth.user.username}</span>
                    </div>
                    <i className='bx bx-check'></i>
                </div>

                <Link to={`/profile/${auth.user._id}`} className="menu__dropdown-box-item" >
                    <span className="menu__dropdown-box-item-louout">
                        Profile
                    </span>
                </Link>
                <div className="menu__dropdown-box-item" onClick={handleLogout}>
                    <span className="menu__dropdown-box-item-louout" >
                        Log out @{auth.user && auth.user.username}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default Menu
