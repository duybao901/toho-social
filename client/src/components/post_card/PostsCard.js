import React from 'react'

import CardHeader from '../post_card/CardHeader';
import CardBody from '../post_card/CardBody';
import CardFooter from '../post_card/CardFooter';
function PostsCard({ post }) {
    return (
        <div className="post__card">
            <CardHeader post={post} />
            <CardBody post={post} id={post._id} />
            <CardFooter post={post} />
        </div>
    )
}

export default PostsCard
