import React, { useEffect, useState } from 'react'
import CommentDisplay from '../comments/CommentDisplay'

const Comments = ({ post }) => {
    const [comments, setComments] = useState([]);
    const [showComments, setShowComments] = useState([]);

    const [next, setNext] = useState(2);

    useEffect(() => {
        const newCm = post.comments.filter(cm => !cm.reply);
        setComments(newCm);
        setShowComments(newCm.slice(newCm.length - next));
    }, [post.comments, next])

    return comments.length > 0 ? <div className="comments__wapper">
        {
            showComments.map(((comment, index) => {
                return <CommentDisplay next={next} comment={comment} key={comment._id} post={post} />
            }))
        }
        {
            comments.length - next > 0 ?
                <div onClick={() => setNext(next + 10)} className="comments__show-more">
                    Show more comments...
                </div>
                :
                comments.length > 2 &&
                <div onClick={() => setNext(2)} className="comments__show-more">
                    Hide comments...
                </div>
        }
    </div> : ""


}

export default Comments
