import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import moment from 'moment'
import * as POST_TYPES from '../../redux/constants/post'
function CardHeader({ post }) {
    const dispatch = useDispatch();
    const { auth } = useSelector(state => state)

    function handleEditPost() {
        dispatch({ type: POST_TYPES.STATUS, payload: { ...post, onEdit: true } })
    }

    return (
        <div className="card__header">
            <div className="card__header-left">
                <Link to={`/profile/${post.user._id}`} className="card__avatar">
                    <img src={post.user.avatar} alt='postuser'>
                    </img>
                </Link>
                <Link to={`/profile/${post.user._id}`} className="card__user-infor">
                    <span className="card__user-infor-fullname">
                        {post.user.fullname}
                    </span>
                    <span className="card__user-infor-username">
                        @{post.user.username} &#8226; {moment(post.createdAt).fromNow(true)}
                    </span>
                </Link>
                {/* <div className="card__header-left user__popup">

                </div> */}
            </div>
            <div className="card__header-right dropdown">
                <i className='dropdown__button bx bx-dots-horizontal-rounded' data-toggle="dropdown" id="dropdownMenuPost" ></i>
                <div className="dropdown-menu" aria-labelledby="dropdownMenuPost" >
                    {
                        auth.user._id === post.user._id ? <>
                            <div onClick={handleEditPost} className="dropdown-item" href="#"><i className='bx bx-pencil'></i>Edit Post</div>
                            <div className="dropdown-item" href="#"><i className='bx bx-trash-alt' ></i>Remove Post</div>
                        </> : ""
                    }
                    <div className="dropdown-item" href="#"><i className='bx bx-copy' ></i>Copy Link</div>
                </div>
            </div>
        </div>
    )
}

export default CardHeader
