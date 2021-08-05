import React, { useState, useEffect } from 'react'
import LikeButton from '../LikeButton'
import { useSelector, useDispatch } from 'react-redux'
import { likePost, unlikePost, savePost, unsavePost } from '../../redux/actions/postAction'
import { Link } from 'react-router-dom'
import ShareModal from '../ShareModal'
// import { BASE_URL } from '../../utils/config'
function CardFooter({ post }) {
    const dispatch = useDispatch();
    const { auth, socket} = useSelector(state => state);
    const [isLike, setIsLike] = useState(false);
    const [loadLike, setLoadLike] = useState(false);

    const [openShareModal, setOpenShareModal] = useState(false);

    const [isSave, setIsSave] = useState(false);
    const [loadSave, setLoadSave] = useState(false);

    useEffect(() => {
        if (post.likes.find(like => like._id === auth.user._id)) {
            setIsLike(true);
        }
    }, [post.likes, auth.user])

    useEffect(() => {
        if (auth.user.saved.find(id => id === post._id)) {
            setIsSave(true);
        }
    }, [auth.user.saved, post])

    const hanldeLike = () => {
        if (loadLike) return;
        setIsLike(true)
        setLoadLike(true);
        dispatch(likePost({ post, auth, socket}));
        setLoadLike(false);
    };

    const hanldeUnLike = async () => {
        if (loadLike) return;
        setIsLike(false)

        setLoadLike(true);
        await dispatch(unlikePost({ post, auth, socket }));
        setLoadLike(false);
    };

    function handleCloseShareModal() {
        setOpenShareModal({
            [`openshare-${post._id}`]: false
        })
    }

    const hanldeSavePost = async () => {
        if (loadSave) return;

        setIsSave(true);

        setLoadSave(true);
        await dispatch(savePost(post, auth));
        setLoadSave(false);
    }
    const hanldeUnSavePost = async () => {
        if (loadSave) return;

        setIsSave(false);

        setLoadSave(true);
        await dispatch(unsavePost(post, auth));
        setLoadSave(false);
    }

    return (
        <div className="card__footer">
            <div className="card__icons">
                <div className="card__icons-box">
                    <LikeButton
                        isLike={isLike}
                        hanldeLike={hanldeLike}
                        hanldeUnLike={hanldeUnLike}
                    />
                    <Link to={`/post/${post._id}`}>
                        <i className='bx bx-message-rounded'></i>
                    </Link>
                    <i className='bx bx-share' onClick={() => setOpenShareModal({ [`openshare-${post._id}`]: true })}></i>
                </div>
                <ShareModal url='https://google.com' open={openShareModal && openShareModal[`openshare-${post._id}`]} handleClose={handleCloseShareModal} />
                <div className="card__bookmark">
                    {
                        !isSave ? <i className='bx bx-bookmark' onClick={hanldeSavePost}></i> :
                            <i onClick={hanldeUnSavePost} className='bx bxs-bookmark' style={{ color: "#1DA1F2" }}></i>
                    }
                </div>
            </div>
            <div className="card__likes">
                <span>
                    {post.likes.length} likes
                </span>
                <span>
                    {post.comments.length} comments
                </span>
            </div>
        </div>
    )
}

export default CardFooter
