import React from 'react'
import { Link } from 'react-router-dom'
function PostThumb({ posts, result, colLg }) {
    if (result === 0) {
        return <h2 style={{ marginLeft: "15px", textAlign: "center" }}>No posts</h2>
    }
    return posts.map(post => {
        return <Link key={post._id} to={`/post/${post._id}`} className={`post__thumb col px-md-2 col-12 col-lg-${colLg ? colLg : 6} col-sm-12`}>
            {

                post.images[0].url.match(/video/i) ?
                    <video controls src={post.images[0].url} alt="post_image_thumb" >

                    </video> :
                    < img src={post.images[0].url} alt="post_image_thumb" />
            }
            <i className='bx bxs-carousel post__thumb-icon-carousel'></i>
            <div className="post__thumb-infor">
                <div>
                    <span>{post.likes.length}</span><i className='bx bxs-heart'></i>
                </div>
                <div>
                    <span>{post.comments.length}</span><i className='bx bxs-comment' ></i>
                </div>

            </div>
        </Link >
    })
}

export default PostThumb
