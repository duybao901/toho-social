import React, { useState, useEffect } from 'react'
import CommentCard from './CommentCard'

const CommentDisplay = ({ comment, post, next, replyCm }) => {

    const [showReplys, setShowReplys] = useState([]);

    const [nextReply, setNextReply] = useState(1);

    useEffect(() => {
        setShowReplys(replyCm.slice(replyCm.length - nextReply < 0 ? 0 : replyCm.length - nextReply))
    }, [replyCm, nextReply])

    return (
        <div className="comment__display">
            <CommentCard commentId={comment._id} comment={comment} post={post} next={next}>
                <div style={{ marginLeft: "40px", marginTop: "10px" }}>
                    {
                        replyCm.length - nextReply > 0 ?
                            <span onClick={() => setNextReply(nextReply + 10)} style={{ marginLeft: "10px" }} className="comments__showmore-reply">
                                {/* <i className='bx bx-subdirectory-right'></i> */}
                                <p>Show more reply</p>
                            </span>
                            :
                            replyCm.length > 1 &&
                            <div className="comments__showmore-reply">
                                <div onClick={() => setNextReply(1)} className="comments__show-more">
                                    <p>Hide reply...</p>
                                </div>
                            </div>
                    }

                    {
                        showReplys.map((item, index) => {
                            return <CommentCard
                                key={index}
                                comment={item}
                                post={post}
                                commentId={comment._id}
                                isReply={true}
                            />
                        })
                    }


                </div>
            </CommentCard>
        </div >
    )
}

export default CommentDisplay
