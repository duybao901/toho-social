import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../../redux/actions/authAction'
const menuList = [
    {
        path: "/",
        text: "home",
        icon: "bx bx-home-circle"
    },
    {
        path: "/explore",
        text: "explore",
        icon: "bx bx-hash"
    },
    {
        path: "/notifications",
        text: "notifications",
        icon: "bx bx-bell"
    },
    {
        path: "/message",
        text: "message",
        icon: "bx bx-comment-detail"
    },
]

function Menu() {
    const location = useLocation();
    const { auth } = useSelector(state => state)
    const dispatch = useDispatch();
    function isActive(path) {
        if (path === location.pathname) {
            return 'active'
        }
        return '';
    }

    function handleLogout() {
        dispatch(logout());
    }

    return (
        <div className='menu'>
            <ul className="menu__list">
                {menuList.map((menu, index) => {
                    return <li className={`menu__list-item ${isActive(menu.path)}`} key={index}>
                        <Link to={menu.path}>
                            <i className={menu.icon}></i>
                            <span>
                                {menu.text}
                            </span>
                        </Link>
                    </li>
                })}
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
