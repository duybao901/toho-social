import React, { useEffect, useState } from 'react'
import CommentDisplay from '../comments/CommentDisplay'

const Comments = ({ post }) => {
    const [comments, setComments] = useState([])
    const [showComments, setShowComments] = useState([])
    const [next, setNext] = useState(2)

    useEffect(() => {
        const newCm = post.comments.filter(cm => !cm.reply)
        setComments(newCm)
        setShowComments(newCm.slice(newCm.length - next < 0 ? 0 : newCm.length - next))
    }, [post.comments, next])

    return comments.length > 0 ? <div className="comments__wapper">
        {
            comments.length - next > 0 ?
                <div className="comments__show-box">
                    <div onClick={() => setNext(next + 10)} className="comments__show-more">
                        Show more comments ...
                    </div>
                    <span className="comments__show-length">
                        {next}/{comments.length}
                    </span>
                </div>
                :
                comments.length > 2 &&
                <div className="comments__show-box">
                    <div onClick={() => setNext(2)} className="comments__show-more">
                        Hide comments ...
                    </div>
                    <span className="comments__show-length">
                        {comments.length}/{comments.length}
                    </span>
                </div>

        }
        {
            showComments.map((comment, index) => (
                <CommentDisplay key={index} comment={comment} post={post} />
            ))
        }

       
    </div> : ""


}

export default Comments
