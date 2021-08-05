import React, { useState, useEffect } from 'react'
import InfiniteScroll from "react-infinite-scroll-component";
import PostThumb from '../PostThumb';
import Loading from '../../images/globle_loading.gif'
import * as PROFILE_TYPES from '../../redux/constants/profile'
import { getDataAPI } from '../../utils/fetchData'
import { useDispatch } from 'react-redux'

function Posts({ id, profile, auth }) {
    const dispatch = useDispatch();
    const [posts, setPosts] = useState([]);
    const [result, setResult] = useState();
    const [stopScroll, setStopScroll] = useState(false);
    const [page, setPage] = useState(0);

    useEffect(() => {
        profile.userPosts.forEach(item => {
            if (item._id === id) {
                setPosts(item.posts)
                setResult(item.result)
                setPage(item.page)
                setStopScroll(item.stopScroll)
            }
        })
    }, [profile.userPosts, id, result])

    const fetchMoreData = async () => {

        if (!stopScroll) {
            const res = await getDataAPI(`/user_posts/${id}?limit=${page * 4}`, auth.token);        
            const newData = {
                ...res.data,
                page: page + 1,
                _id: id,
                stopScroll: result === res.data.result ? true : false
            }
            dispatch({ type: PROFILE_TYPES.UPDATE_POST, payload: newData })
        }
    }

    return (
        <div className="profile__posts">
            {
                posts.length === 0 ? <h2 className="mx-auto d-block">No Posts</h2> :
                    posts.length < 4 ?
                        <div className="row no-gutters " style={{ padding: "10px" }}>
                            <PostThumb result={result} posts={posts} />
                        </div>
                        :
                        <InfiniteScroll
                            className="profile__post-wrapper"
                            style={{ overflowX: "hidden"}}
                            dataLength={posts.length}
                            next={fetchMoreData}
                            hasMore={true}
                            loader={!stopScroll && <img className="mx-auto d-block" style={{ width: "50px", }} src={Loading} alt='discover-loading'>
                            </img>}
                        >
                            <div className="row no-gutters ">
                                <PostThumb colLg={6} posts={posts} result={result} />
                            </div>
                        </InfiniteScroll>
                      
            }
        </div>
    )
}

export default Posts
