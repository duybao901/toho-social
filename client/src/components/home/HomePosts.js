import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Loading from '../../images/globle_loading.gif'

import PostsCard from '../post_card/PostsCard';
import InfiniteScroll from "react-infinite-scroll-component";
import { getDataAPI } from '../../utils/fetchData'
import * as POST_TYPES from '../../redux/constants/post'

function HomePosts() {
    const dispatch = useDispatch();
    const { homePost, auth } = useSelector(state => state);

    const fetchMoreData = async () => {
        if (!homePost.stopScroll) {
            const res = await getDataAPI(`/posts?limit=${homePost.page * 9}`, auth.token)
            dispatch({ type: POST_TYPES.UPDATE_HOME_POSTS, payload: res.data })
      }
    }

    return (
        <div className="posts">
            {
                !homePost.loading ?
                    homePost.posts.length > 0 ?
                        homePost.posts.length < 9 ?
                            homePost.posts.map((post) => {
                                return <PostsCard post={post} key={post._id} />
                            })
                            :
                            <InfiniteScroll
                                style={{ overflowX: "hidden" }}
                                dataLength={homePost.posts.length}
                                next={fetchMoreData}
                                hasMore={true}
                                loader={!homePost.stopScroll && <img className="mx-auto d-block" style={{ width: "50px", }} src={Loading} alt='discover-loading'>
                                </img>}
                            >
                                {
                                    homePost.posts.map((post) => {
                                        return <PostsCard post={post} key={post._id} />
                                    })
                                }
                            </InfiniteScroll>
                        :
                        <div>
                            <h2>
                                No Posts
                            </h2>
                        </div>
                    : <div className="posts__loading">
                        <img src={Loading} alt='loading'></img>
                    </div>
            }
        </div>
    )
}

export default HomePosts
