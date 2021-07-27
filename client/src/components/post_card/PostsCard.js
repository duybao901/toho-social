import React from 'react'

import CardHeader from '../post_card/CardHeader';
import CardBody from '../post_card/CardBody';
import CardFooter from '../post_card/CardFooter';

import Comments from './Comments';
import InputComment from './InputComment';
function PostsCard({ post, isDetailPost }) {
    return (
        <div className="post__card">
            <div className="indicator"></div>
            <CardHeader post={post} />
            <CardBody post={post} id={post._id} isDetailPost={isDetailPost}/>
            <CardFooter post={post} />


            <Comments post={post} />
            <InputComment post={post} />

        </div>
    )
}

export default PostsCard
