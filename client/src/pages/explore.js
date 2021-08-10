import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getDiscoverPosts } from '../redux/actions/discoverAction'
import Loading from '../images/globle_loading.gif'
import PostThumb from '../components/PostThumb'
import InfiniteScroll from "react-infinite-scroll-component";
import * as DISCOVER_TYPES from '../redux/constants/discover'
import { getDataAPI } from '../utils/fetchData'
import Search from '../components/search/Search'
import Suggestion from '../components/Suggestion'

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
            const res = await getDataAPI(`/post_discover?num=${discover.page * 9}`, auth.token);
            dispatch({ type: DISCOVER_TYPES.UPDATE_DISCOVER, payload: res.data })
            window.scrollTo({
                top: discover.page * 300,
                behavior: 'smooth'
            });
        }
    }

    return (
        <div className="main__container-right discover">
            <div className="discover__search-header">
                <Search />
            </div>
            <div className="row" >
                <div className="col col-sm-12 col-md-12 col-lg-7 ">
                    {
                        discover.loading ?
                            <div className="discover__loading-container">
                                <img src={Loading} alt='discover-loading'>
                                </img>
                            </div>
                            :
                            discover.posts.length === 0 ? <h2 className="mx-auto d-block">No Posts</h2> :
                                discover.posts.length < 6 ?
                                    <div className="row no-gutters middle__content" style={{ padding: "10px" }}>
                                        <PostThumb colLg={6} posts={discover.posts} result={discover.result} />
                                    </div>
                                    :
                                    <InfiniteScroll
                                        dataLength={discover.posts}
                                        next={fetchMoreData}
                                        hasMore={true}
                                        loader={!discover.stopScroll && <img className="mx-auto d-block" style={{ width: "50px", }} src={Loading} alt='discover-loading'>
                                        </img>}
                                    >
                                        <div className="row no-gutters middle__content" style={{ padding: "5px 0px" }}>
                                            <PostThumb colLg={6} posts={discover.posts} result={discover.result} />
                                        </div>
                                    </InfiniteScroll>

                    }
                </div>
                <div className="col-lg-5 right__sidebar">
                    <div className="infor__search-container">
                        <Search />
                    </div>
                    <div className="infor__search-container suggest-container">
                        <Suggestion />
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Explore
