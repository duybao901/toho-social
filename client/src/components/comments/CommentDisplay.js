import React from 'react'
import CommentCard from './CommentCard'

const CommentDisplay = ({ comment, post, next }) => {
    return (
        <div className="comment__display">
            <CommentCard comment={comment} post={post} next={next}/>
        </div >
    )
}

export default CommentDisplay
