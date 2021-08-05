import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { removeComment } from '../../redux/actions/commentAction'

function CommentMenu({ post, comment, auth, setOnedit }) {
    const dispatch = useDispatch()
    const { socket } = useSelector(state => state);

    function handleRemoveComment() {
        dispatch(removeComment(post, comment, auth, socket));
    }

    const menuItem = () => {
        return <>
            <div onClick={() => setOnedit(true)} className="dropdown-item comment__menu-item"><i className='bx bx-pencil'></i>Edit</div>
            <div onClick={handleRemoveComment} className="dropdown-item comment__menu-item"><i className='bx bx-trash-alt' ></i>Remove</div>
        </>
    }

    return (
        <div className="comment__menu">
            {
                (post.user._id === auth.user._id || comment.user._id === auth.user._id) &&
                <div className="comment__menu">
                    <i className='bx bx-dots-vertical-rounded comment__menu-button' data-toggle="dropdown" id={`moreLink${comment._id}`}></i>
                    <div className="dropdown-menu" aria-labelledby={`moreLink${comment._id}`}>
                        {
                            post.user._id === auth.user._id ?
                                comment.user._id === auth.user._id ? menuItem() :
                                    <div>
                                        <div onClick={handleRemoveComment} className="dropdown-item comment__menu-item"><i className='bx bx-trash-alt' ></i>Remove</div>
                                    </div> : comment.user._id === auth.user._id && menuItem()
                        }
                    </div>
                </div>

            }
        </div>
    )
}

export default CommentMenu

