import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import dayjs from 'dayjs'

import Search from "../search/Search"
import * as profileAction from '../../redux/actions/profileAction'
import EditProfile from '../editprofile/EditProfile'

function Infor({ id }) {
    const dispatch = useDispatch();
    const { auth, profile } = useSelector(state => state)
    const [userData, setUserData] = useState([]);
    const [openEdit, setOpenEdit] = useState(false);

    function openModalEditProfile() {
        setOpenEdit(true)
    }
    function closeModalEditProfile() {
        setOpenEdit(false)
    }


    useEffect(() => {
        if (id === auth.user._id) {
            setUserData([auth.user]);
        } else {
            dispatch(profileAction.getProfileUser({ users: profile.users, id, auth }));
            const newData = profile.users.filter(user => user._id === id);
            setUserData(newData);
        }
    }, [auth, id, dispatch, profile.users])

    function displayImage(avatar) {
        dispatch({ type: "SHOW", payload: { show: true, img: avatar } })
    }

    return (
        <div className="infor">
            {userData.length > 0 && userData.map((user) => {
                return <div className="infor__container" key={user._id}>
                    <div className="infor__content">
                        <div className="infor__heading">
                            <Link to='/' className="infor__heading-back">
                                <i className='bx bx-arrow-back' ></i>
                            </Link>
                            <div className="infor__heading-name">
                                <span style={{ fontSize: '2rem', fontWeight: "800" }}>{user && user.fullname}</span>
                                <span style={{ fontSize: '1.2rem', fontWeight: "400" }}>1 Post</span>
                            </div>
                        </div>
                        <div className='infor__box'>
                            <div className="infor__user-background">
                                <img onClick={() => displayImage(user.background)} src="https://res.cloudinary.com/dxnfxl89q/image/upload/v1625327484/Toho/close-up-opened-umbrella-mockup_53876-98796_nj3un5.jpg" alt='backgrounduser'>
                                </img>
                            </div>
                            <div className="infor__user">
                                <div className="infor__user-left">
                                    <div className="infor__user-avatar" >
                                        <img src={user.avatar} alt='useravatar' onClick={() => displayImage(user.avatar)}>
                                        </img>
                                    </div>
                                    <div>
                                        <h3 className="infor__user-left-fullname">{user.fullname}</h3>
                                        <span className="infor__user-left-username">@{user.username}</span>
                                        <p className="infor__user-left-bio">
                                            Soon I’ll be sixty years old.
                                            Will I think the world is cold
                                            or will I have a lot of children
                                            who can warm me?
                                        </p>

                                        <div className='infor__user-social-link'>
                                            <i className='bx bx-link' ></i>
                                            <a href="https://github.com/duycarry123">
                                                https://github.com/duycarry123
                                            </a>
                                        </div>
                                        <div className='infor__user-social'>
                                            <div className='infor__user-social-map'>
                                                <i className='bx bx-map' ></i>
                                                Ninh Kieu, Can Tho, Viet Nam
                                            </div>
                                            <div>
                                                <i className='bx bx-calendar' ></i>
                                                Joined {dayjs(user.createdAt).format('MMMM YYYY')}
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                {id === auth.user._id ? <div onClick={openModalEditProfile} className='infor__user-btn-edit'>
                                    Edit Profile
                                </div> : <div className='infor__user-btn-edit'>
                                    Follow
                                </div>}

                            </div>
                        </div>

                    </div>

                    <div className="infor__search">
                        <div className="infor__search-container">
                            <Search />
                        </div>
                    </div>
                </div>
            })}
            <EditProfile open={openEdit} handleClose={closeModalEditProfile} users={userData && userData} />
        </div>
    )
}

export default Infor
