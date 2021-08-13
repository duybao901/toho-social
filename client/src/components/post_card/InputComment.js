import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

import { createComment } from '../../redux/actions/commentAction'
import Icons from '../Icons'

const InputComment = ({ children, post, onReply, setOnReply }) => {
    const dispatch = useDispatch();
    const { auth, socket } = useSelector(state => state);
    const [content, setContent] = useState('');

    function handleSubmit(e) {
        e.preventDefault();
        if (!content.trim()) {
            if (setOnReply) return setOnReply(false);
            return
        };

        const newComment = {
            content,
            likes: [],
            user: auth.user,
            createAt: new Date().toISOString(),
            reply: onReply && onReply.commentId,
            tag: onReply && onReply.user,
        }

        dispatch(createComment(post, newComment, auth, socket));
        setContent('');
        if (setOnReply) return setOnReply(false);
    }

    return (
        <form onSubmit={handleSubmit} className="form__comment">
            {children}
            {onReply && <Link to={`/profile/${onReply.user._id}`} className="reply__username">{onReply && '@' + onReply.user.username}: </Link>}
            <img className="form__comment-avatar" src={auth.user.avatar} alt="input-avatar"></img>
            <div className="form__comment-input">
                <input placeholder="Add a comment..." type="text" value={content} onChange={e => setContent(e.target.value)} />
                <Icons setContent={setContent} content={content} />
            </div>
            <button type="submit">
                post
            </button>
        </form>
    )
}

export default InputComment
