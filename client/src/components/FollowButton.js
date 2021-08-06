import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { follow, unfollow } from '../redux/actions/profileAction'
function FollowButton({ user }) {
    const dispatch = useDispatch();
    const { auth, profile, socket } = useSelector(state => state)
    const [followed, setFollowed] = useState(false);

    useEffect(() => {
        if (auth.user.followings.find(item => item._id === user._id)) {
            setFollowed(true);
        }
    }, [auth.user.followings, user._id])

    function handleFollowed() {
        dispatch(follow({ users: profile.users, user, auth, socket}));
        setFollowed(true);
    }

    function hanldeUnFollowed() {
        setFollowed(false);
        dispatch(unfollow({ users: profile.users, user, auth, socket }));
    }


    return (
        <React.Fragment>
            {followed ? <div onClick={hanldeUnFollowed} className={followed ? "infor__user-btn-edit btn__followed btn__follow" : 'infor__user-btn-edit'}>
                <span>
                    Following
                </span>
                <span>
                    Unfollow
                </span>
            </div> : <div onClick={handleFollowed} className='infor__user-btn-edit btn__follow'>
                Follow
            </div>
            }

        </React.Fragment >
    )
}

export default FollowButton
