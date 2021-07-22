import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import moment from 'moment';

import LikeButton from '../LikeButton'
import CommentMenu from './CommentMenu';

import { updateComment, likeComment, unlikeComment } from '../../redux/actions/commentAction'

function CommentCard({ comment, post, next }) {
    const dispatch = useDispatch();
    const { auth } = useSelector(state => state);
    const [content, setContent] = useState('');
    const [readMore, setReadeMore] = useState(false);

    const [isLike, setIsLike] = useState(false);
    const [loadLike, setLoadLike] = useState(false)

    const [onEdit, setOnedit] = useState(false);

    const hanldeLike = async () => {
        if (loadLike) return;
        setIsLike(true)

        setLoadLike(true);
        await dispatch(likeComment(post, comment, auth))
        setLoadLike(false);
    }

    const hanldeUnLike = async () => {
        setIsLike(false)

        if (loadLike) return;
        setIsLike(true)

        setLoadLike(true);
        await dispatch(unlikeComment(post, comment, auth))
        setLoadLike(false);
    }

    // set is like
    useEffect(() => {
        if (comment.likes.find(item => item._id === auth.user._id)) {
            setIsLike(true)
        } else {
            setIsLike(false)
        }
    }, [comment.likes, auth.user._id])

    // Click show more and close edit comment
    useEffect(() => {
        setOnedit(false)
    }, [next])

    // Set content
    useEffect(() => {
        setContent(comment.content)
    }, [comment])

    var commentCardStyle = {
        opacity: !comment._id ? "0.5" : "1",
        pointerEvents: !comment._id ? 'none' : 'inherit',
    }

    const handleUpdateComment = () => {
        if (comment.content !== content) {
            dispatch(updateComment(post, comment, content, auth))
            setOnedit(false);
        } else {
            setOnedit(false);
        }
    }



    return (
        <div className="comment__card" style={commentCardStyle}>
            <Link className="comment__card-avatar" to={`/profile/${comment.user._id}`}>
                <img src={comment.user.avatar} alt={comment.user.avatar}></img>
            </Link>
            <div className="comment__card-body">
                <div className="comment__card-box">
                    <div className="comment__card-infor">
                        <Link to={`/profile/${comment.user._id}`}>
                            {comment.user.username}
                        </Link>
                        {!onEdit && <span className="comment__card-content">
                            {
                                content.length < 100 ? content :
                                    readMore ? content + " " : content.slice(0, 100) + "... "
                            }
                            {
                                content.length > 100 &&
                                <span className="readMore" onClick={() => setReadeMore(!readMore)}>
                                    {readMore ? "Hide content" : "Read more"}
                                </span>
                            }
                        </span>}
                        {onEdit && <div className="comment__edit" style={{ display: "block" }}>
                            <input autoFocus={onEdit} value={content} type='text' onChange={(e) => setContent(e.target.value)}></input>
                        </div>}
                    </div>
                    <div className="comment__action">
                        <CommentMenu post={post} comment={comment} auth={auth} setOnedit={setOnedit} />
                        <LikeButton
                            isLike={isLike}
                            hanldeLike={hanldeLike}
                            hanldeUnLike={hanldeUnLike}
                            size={1.4}
                        />
                    </div>
                </div>
                <div className="comment__card-rep">
                    <small className="comment__day">
                        {moment(comment.createdAt).fromNow()}
                    </small>
                    <small>
                        {comment.likes.length} likes
                    </small>
                    {
                        !onEdit ?
                            <small>
                                Reply
                            </small>
                            : <>
                                <small style={{ color: '#1DA1F2' }} onClick={handleUpdateComment}>
                                    Update
                                </small>
                                <small style={{ color: 'crimson' }} onClick={() => setOnedit(false)}>
                                    Cancel
                                </small>
                            </>
                    }
                </div>
            </div>
        </div >
    )
}

export default CommentCard
