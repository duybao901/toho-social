import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from "react-router-dom"
import FollowButton from './FollowButton'
import Loading from '../images/globle_loading.gif'
import { getSuggestionUser } from '../redux/actions/suggestionAction'
function Suggestion() {
    const dispatch = useDispatch();
    const { suggestion, auth } = useSelector(state => state);

    return (
        <>
            <div className="suggest">
                <div className="suggest__header">
                    <h2 className="suggest__title">
                        Suggest for you
                    </h2>
                    {
                        !suggestion.loading && <div className="suggest__reload" onClick={() => dispatch(getSuggestionUser(auth.token))}>
                            <i className='bx bx-revision'></i>
                        </div>
                    }
                </div>
                <ul>
                    {
                        suggestion.loading && <div className="suggest__loading-container" >
                            <img src={Loading} alt='suggest-loading' style={{ width: '50px' }}>
                            </img>
                        </div>
                    }
                    {
                        !suggestion.loading && suggestion.users.map((user, index) => {
                            return <li to={`/profile/${user._id}`} key={index} className="suggest__card">
                                <div className="suggest__card-right">
                                    <Link to={`/profile/${user._id}`} className="suggest__card-image">
                                        <img src={user.avatar} alt=''></img>
                                    </Link>
                                    <Link to={`/profile/${user._id}`} className="suggest__card-infor">
                                        <span style={{ fontSize: '14px', fontWeight: "700" }}>{user.fullname}</span>
                                        <span style={{ fontSize: '14px', fontWeight: "400" }}>@{user.username}</span>
                                    </Link>
                                </div>
                                <FollowButton user={user} />
                            </li>
                        })
                    }
                </ul>
            </div>
            <div className="suggest__copyright">
                <a href="https://www.facebook.com/bao.duy.076" target="_blank" rel="noreferrer">
                    https://www.facebook.com/bao.duy.076
                </a>
                <a href="https://www.youtube.com/channel/UCGRDayozk2qch3vw-qAtQng" target="_blank" rel="noreferrer">
                    MERN Stack - Build a social media app - Dev A.T Viet Nam
                </a>
                <p>
                    © 2021 Toho, Inc.
                </p>
            </div>
        </>
    )
}

export default Suggestion

