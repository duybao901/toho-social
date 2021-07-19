import React, { useState, useEffect } from 'react'
import LikeButton from '../LikeButton'
import { useSelector, useDispatch } from 'react-redux'
import { likePost,unlikePost } from '../../redux/actions/postAction'
function CardFooter({ post }) {
    const dispatch = useDispatch();
    const { auth } = useSelector(state => state);
    const [isLike, setIsLike] = useState(false);
    const [loadLike, setLoadLike] = useState(false);


    useEffect(() => {
        if (post.likes.find(like => like._id === auth.user._id)) {
            setIsLike(true);
        }
    }, [post.likes, auth.user])

    const hanldeLike = () => {
        if (loadLike) return;
        setIsLike(true)
        setLoadLike(true);
        dispatch(likePost({ post, auth }));
        setLoadLike(false);
    };

    const hanldeUnLike = () => {
        if (loadLike) return;
        setIsLike(false)

        setLoadLike(true);
        dispatch(unlikePost({ post, auth }));
        setLoadLike(false);
    };

    return (
        <div className="card__footer">
            <div className="card__icons">
                <div className="card__icons-box">
                    <LikeButton
                        isLike={isLike}
                        hanldeLike={hanldeLike}
                        hanldeUnLike={hanldeUnLike}
                    />
                    <i className='bx bx-message-rounded'></i>
                    <i className='bx bx-share' ></i>
                </div>
                <div className="card__bookmark">
                    <i className='bx bx-bookmark' ></i>
                </div>
            </div>
            <div className="card__likes">
                <span>
                    {post.likes.length} likes
                </span>
                <span>
                    0 comments
                </span>
            </div>
        </div>
    )
}

export default CardFooter
