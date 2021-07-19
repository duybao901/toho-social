import React from 'react'
import { useSelector } from 'react-redux'
import Loading from '../../images/globle_loading.gif'

import PostsCard from '../post_card/PostsCard';

function HomePosts() {
    const { homePost } = useSelector(state => state);
    return (
        <div className="posts">
            {!homePost.loading ?
                homePost.result > 0 ? homePost.posts.map(post => {
                    return <PostsCard post={post} key={post._id} />
                }) : <div>
                    <h2>
                        No Posts
                    </h2>
                </div>
                : <div className="posts__loading">
                    <img src={Loading} alt='loading'></img>
                </div>}
        </div>
    )
}

export default HomePosts
