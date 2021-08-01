import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import dayjs from 'dayjs'


import EditProfile from '../editprofile/EditProfile'
import Followings from '../follow/Followings'
import Followers from '../follow/Followers'

import FollowButton from '../FollowButton'

function Infor({ id, auth, profile, dispatch }) {
    const [userData, setUserData] = useState([]);
    const [openEdit, setOpenEdit] = useState(false);
    const [followers, setFollowers] = useState(false);
    const [followings, setFollowings] = useState(false);

    function openModalEditProfile() {
        setOpenEdit(true)
    }
    function closeModalEditProfile() {
        setOpenEdit(false)
    }

    function handleOpenFollowers() {
        setFollowers(true);
    }

    function handleOpenFollowings() {
        setFollowings(true);
    }


    useEffect(() => {
        if (id === auth.user._id) {
            setUserData([auth.user]);
        } else {
            const newData = profile.users.filter(user => user._id === id);
            setUserData(newData);
        }
    }, [auth, id, dispatch, profile.users])

    function displayImage(avatar) {
        dispatch({ type: "SHOW", payload: { show: true, img: avatar } })
    }

    return (
        <>
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
                                <img onClick={() => displayImage(user.background.replace('c_crop', 'c_fit'))} src={user.background} alt='backgrounduser'>
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
                                        {user.story && <p className="infor__user-left-bio">
                                            {user.story}
                                        </p>}
                                        <div className='infor__user-social-link'>
                                            {user.website && <React.Fragment>
                                                <i className='bx bx-link'></i>
                                                <a href="https://github.com/duycarry123">
                                                    {user.website}
                                                </a>
                                            </React.Fragment>}
                                        </div>
                                        <div className='infor__user-social'>
                                            {user.address && <div className='infor__user-social-map'>
                                                <i className='bx bx-map' ></i>
                                                {user.address}
                                            </div>}
                                            <div>
                                                <i className='bx bx-calendar' ></i>
                                                Joined {dayjs(user.createdAt).format('MMMM YYYY')}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="infor__user-follow">
                                        <p onClick={handleOpenFollowers}>
                                            <span>{user.followers.length}</span> Followers
                                        </p>
                                        {followers && <Followers setFollowers={setFollowers} followers={followers} users={user.followers} />}
                                        <p onClick={handleOpenFollowings}>
                                            <span>{user.followings.length}</span> Following
                                        </p>
                                        {followings && <Followings setFollowings={setFollowings} followings={followings} users={user.followings} />}
                                    </div>
                                </div>
                                {id === auth.user._id ? <div onClick={openModalEditProfile} className='infor__user-btn-edit'>
                                    Edit Profile
                                </div> : <FollowButton user={user} />}

                            </div>
                        </div>

                    </div>
                    {/* <div className="infor__search">
                        <div className="infor__search-container">
                            <Search />
                        </div>
                    </div> */}
                </div>
            })}
            <EditProfile open={openEdit} handleClose={closeModalEditProfile} users={userData && userData} />
        </>
    )
}

export default Infor
