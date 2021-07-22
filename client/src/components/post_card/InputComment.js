import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { createComment } from '../../redux/actions/commentAction'

const InputComment = ({ children, post }) => {
    const dispatch = useDispatch();
    const { auth } = useSelector(state => state);
    const [content, setContent] = useState('');

    function handleSubmit(e) {
        e.preventDefault();

        if (!content.trim()) return;

        const newComment = {
            content,
            likes: [],
            user: auth.user,
            createAt: new Date().toISOString()
        }

        dispatch(createComment(post, newComment, auth));
        setContent('');
    }

    return (
        <form onSubmit={handleSubmit} className="form__comment">
            {children}
            <img className="form__comment-avatar" src={auth.user.avatar} alt="input-avatar"></img>
            <input placeholder="Add a comment..." type="text" value={content} onChange={e => setContent(e.target.value)} />
            <button type="submit">
                post
            </button>
        </form>
    )
}

export default InputComment
