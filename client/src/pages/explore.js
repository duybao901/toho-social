import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getDiscoverPosts } from '../redux/actions/discoverAction'
import Loading from '../images/globle_loading.gif'
import PostThumb from '../components/PostThumb'
import InfiniteScroll from "react-infinite-scroll-component";
import * as DISCOVER_TYPES from '../redux/constants/discover'
import { getDataAPI } from '../utils/fetchData'

function Explore() {
    const dispatch = useDispatch();
    const { auth, discover } = useSelector(state => state)

    useEffect(() => {
        if (!discover.firstLoad) {
            dispatch(getDiscoverPosts(auth.token))
        }
    }, [auth.token, dispatch, discover.firstLoad])

    const fetchMoreData = async () => {
        if (!discover.stopScroll) {
            const res = await getDataAPI(`/post_discover?limit=${discover.page * 9}`, auth.token);
            dispatch({ type: DISCOVER_TYPES.UPDATE_DISCOVER, payload: res.data })
        }
    }

    return (
        <div className="main__container-right discover">
            {
                discover.loading ?
                    <div className="discover__loading-container">
                        <img src={Loading} alt='discover-loading'>
                        </img>
                    </div>
                    :
                    discover.posts.length === 0 ? <h2 className="mx-auto d-block">No Posts</h2> :
                        discover.posts.length < 9 ?
                            <div className="row no-gutters " style={{ padding: "10px" }}>
                                <PostThumb colLg={4} posts={discover.posts} result={discover.result} />
                            </div>
                            :
                            <InfiniteScroll
                                dataLength={discover.posts}
                                next={fetchMoreData}
                                hasMore={true}
                                loader={!discover.stopScroll && <img className="mx-auto d-block" style={{ width: "50px", }} src={Loading} alt='discover-loading'>
                                </img>}
                            >
                                <div className="row no-gutters " style={{ padding: "10px" }}>
                                    <PostThumb colLg={4} posts={discover.posts} result={discover.result} />
                                </div>
                            </InfiniteScroll>

            }
        </div>
    )
}

export default Explore
