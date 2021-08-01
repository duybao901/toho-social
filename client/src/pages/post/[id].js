import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { getDetailPost } from '../../redux/actions/postAction'

import PostsCard from '../../components/post_card/PostsCard'
import Loading from '../../images/globle_loading.gif'

function DedailPost() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { auth, detailPost } = useSelector(state => state)

    const [posts, setPosts] = useState([]);

    useEffect(() => {
        dispatch(getDetailPost(detailPost, id, auth))
        if (detailPost.length > 0) {
            const newArr = detailPost.filter(post => post && post._id === id);
            setPosts(newArr)
        }
    }, [id, detailPost, dispatch, auth])
    return (
        <div className="main__container-right detail__post">
          
            {
                posts.length === 0 && <div className="detailt__post-loading">
                    <img src={Loading} alt="loading"></img>
                </div>
            }
            {
                posts.length > 0 && posts.map((post) => {
                    return <PostsCard post={post} key={post._id} isDetailPost={true} />
                })
            }
        </div>
    )
}

export default DedailPost
