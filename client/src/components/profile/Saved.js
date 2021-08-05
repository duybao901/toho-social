import React, { useState, useEffect } from 'react'
import InfiniteScroll from "react-infinite-scroll-component";
import PostThumb from '../PostThumb';
import Loading from '../../images/globle_loading.gif'
import * as GLOBLE_TYPES from '../../redux/constants/index'

import { getDataAPI } from '../../utils/fetchData'
import { useDispatch } from 'react-redux'
function Saved({ id, profile, auth }) {
    const dispatch = useDispatch();
    const [savePosts, setSavePosts] = useState([]);
    const [result, setResult] = useState();
    const [stopScroll, setStopScroll] = useState(false);
    const [page, setPage] = useState(2);
    const [load, setLoad] = useState(false);

    useEffect(() => {
        setLoad(true);
        getDataAPI("/get_saved_post?limit=4", auth.token)
            .then(res => {
                setSavePosts(res.data.savePosts);
                setResult(res.data.result)
                setLoad(false);
            }).catch(error => {
                setLoad(false);
                dispatch({ type: GLOBLE_TYPES.NOTIFY, payload: { err: error.response.data.msg } })
            })
    }, [auth.token, dispatch])

    const fetchMoreData = async () => {
        if (!stopScroll) {
            const res = await getDataAPI(`/get_saved_post/?limit=${page * 4}`, auth.token);
            setSavePosts(res.data.savePosts);
            setPage(page + 1);
            setResult(res.data.result)
            setStopScroll(result === res.data.result ? true : false);
        }
    }

    return (
        <div className="profile__posts">
            {
                !load ?
                    savePosts.length === 0 ? <h2 className="mx-auto d-block">No Posts</h2> :
                        savePosts.length < 4 ?
                            <div className="row no-gutters " style={{ padding: "10px" }}>
                                <PostThumb result={result} posts={savePosts} />
                            </div>
                            :
                            <InfiniteScroll
                                className="profile__post-wrapper"
                                style={{ overflowX: "hidden" }}
                                dataLength={savePosts.length}
                                next={fetchMoreData}
                                hasMore={true}
                                loader={!stopScroll && <img className="mx-auto d-block" style={{ width: "50px", }} src={Loading} alt='discover-loading'>
                                </img>}
                            >
                                <div className="row no-gutters ">
                                    <PostThumb colLg={6} posts={savePosts} result={result} />
                                </div>
                            </InfiniteScroll>
                    : <div style={{ width: "100%", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img className="mx-auto d-block" style={{ width: "50px", }} src={Loading} alt='discover-loading'>
                        </img>
                    </div>
            }
        </div>
    )
}

export default Saved
