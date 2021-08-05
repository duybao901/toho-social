import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import moment from 'moment';

import LikeButton from '../LikeButton'
import CommentMenu from './CommentMenu';
import InputComment from '../post_card/InputComment'

import { updateComment, likeComment, unlikeComment } from '../../redux/actions/commentAction'


function CommentCard({ children, comment, post, next, commentId, isReply }) {
    const dispatch = useDispatch();
    const { auth, socket } = useSelector(state => state);
    const [content, setContent] = useState('');
    const [readMore, setReadeMore] = useState(false);

    const [isLike, setIsLike] = useState(false);
    const [loadLike, setLoadLike] = useState(false)

    const [onEdit, setOnedit] = useState(false);

    const [onReply, setOnReply] = useState(false);

    const hanldeLike = async () => {
        if (loadLike) return;
        setIsLike(true)

        setLoadLike(true);
        await dispatch(likeComment(post, comment, auth, socket))
        setLoadLike(false);
    }

    const hanldeUnLike = async () => {
        setIsLike(false)

        if (loadLike) return;
        setIsLike(true)

        setLoadLike(true);
        await dispatch(unlikeComment(post, comment, auth, socket))
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
        alignItems: isReply && 'flex-start',
        borderTopLeftRadius: isReply && '0px'
    }

    const handleUpdateComment = () => {
        if (comment.content !== content) {
            dispatch(updateComment(post, comment, content, auth, socket))
            setOnedit(false);
        } else {
            setOnedit(false);
        }
    }

    // Open Reply
    function handleReply() {
        if (onReply) return setOnReply(false);

        setOnReply({ ...comment, commentId });
    }

    var styleReplyAvatar = {
        width: "32px",
        height: "32px"
    }

    return (
        <>
            <div className="comment__card" style={commentCardStyle}>
                <Link className="comment__card-avatar" to={`/profile/${comment.user._id}`}>
                    <img style={isReply && styleReplyAvatar} src={comment.user.avatar} alt={comment.user.avatar}></img>
                </Link>
                <div className="comment__card-body">
                    <div className="comment__card-box">
                        <div className="comment__card-infor">
                            <div>
                                <Link to={`/profile/${comment.user._id}`}>
                                    {comment.user.username}
                                </Link>
                                {comment.tag && comment.tag._id !== comment.user._id && <Link className="comment__reply-tag" to={`/profile/${comment.tag._id}`}>
                                    @{comment.tag.username}
                                </Link>}
                            </div>
                            {
                                !onEdit && <span className="comment__card-content">
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
                                </span>
                            }
                            {
                                onEdit && <div className="comment__edit" style={{ display: "block" }}>
                                    <input autoFocus={onEdit} value={content} type='text' onChange={(e) => setContent(e.target.value)}></input>
                                </div>
                            }
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

                </div>
            </div >
            <div className="comment__card-rep">
                <small className="comment__day">
                    {moment(comment.createdAt).fromNow(true)} <span>&#8226;</span>
                </small>
                <small>
                    {comment.likes.length} likes <span>&#8226;</span>
                </small>
                {
                    !onEdit ?
                        <small onClick={handleReply} style={{ userSelect: 'none' }}>
                            {onReply ? <span style={{ color: 'crimson', fontWeight: "600", fontSize: "12px" }} >Cancel</span> : 'Reply'}
                        </small>
                        : <>
                            <small style={{ color: '#1DA1F2' }} onClick={handleUpdateComment}>
                                Update
                            </small>
                            <small style={{ color: 'crimson', marginLeft: "8px" }} onClick={() => { setOnedit(false); setContent(comment.content) }}>
                                Cancel
                            </small>
                        </>
                }
            </div>
            {
                onReply && <InputComment comment={comment} post={post} onReply={onReply} setOnReply={setOnReply}>

                </InputComment>
            }
            {children}
        </>
    )
}

export default CommentCard
