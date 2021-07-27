import React, { useState, useEffect } from 'react'

import PostThumb from '../PostThumb';

function Posts({ id, auth, profile, dispatch }) {
    const [posts, setPosts] = useState([]);
    const [result, setResult] = useState();
    useEffect(() => {
        profile.userPosts.forEach(item => {
            if (item._id === id) {
                setPosts(item.posts)
                setResult(item.result)
            }
        })
    }, [profile.userPosts, id])
    return (
        <div className="profile__posts">
            <div className="row">
                <PostThumb result={result} posts={posts} id={id} auth={auth} dispatch={dispatch} />
            </div>
        </div>
    )
}

export default Posts
