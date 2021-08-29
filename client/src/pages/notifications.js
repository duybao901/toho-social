import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import Search from '../components/search/Search';
import Suggestion from '../components/Suggestion';
import Loading from "../images/globle_loading.gif"
import moment from 'moment'
import { isReadNotify, deleteAllNotify } from "../redux/actions/notifyAction"
import * as NOTIFICATION_TYPES from '../redux/constants/notifycation'

function Notifications() {
    const dispatch = useDispatch();
    const { auth, notification } = useSelector(state => state);

    const handleisReadNotify = (msg) => {
        dispatch(isReadNotify(msg, auth))
    }
    const handleSound = () => {
        dispatch({ type: NOTIFICATION_TYPES.SOUND_NOTIFICATION, payload: !notification.sound })
    }

    const deleteAllNotification = () => {
        const newArray = notification.data.filter(item => item.isRead === false);

        if (newArray.length === 0) return dispatch(deleteAllNotify(auth));

        if (window.confirm(`You have ${newArray.length} unread notices. Are you sure want to delete all?`)) {
            return dispatch(deleteAllNotify(auth));
        }
    }

    return (
        <div className="main__container-right notification">
            <div className="row" style={{ marginTop: '0px' }}>
                <div className="col col-sm-12 col-md-12 col-lg-7 ">
                    <div className="main__content" >
                        <div className="home__header main__header">
                            <div className='main__header-right' >
                                <h2 style={{ cursor: 'pointer' }} className="main__header-title" onClick={() => window.scrollTo({ top: 0 })}>
                                    Notifications
                                </h2>
                            </div>
                            <div className="main__header-left">
                                {
                                    notification.sound ?
                                        <i
                                            style={{ fontSize: '2rem', color: "#1DA1F2", cursor: 'pointer' }}
                                            className='bx bx-bell'
                                            onClick={handleSound}
                                        ></i>
                                        :
                                        <i
                                            style={{ fontSize: '2rem', color: "#1DA1F2", cursor: 'pointer' }}
                                            className='bx bx-bell-off'
                                            onClick={handleSound}
                                        ></i>
                                }
                            </div>
                        </div>
                        <div style={{ position: 'relative', top: "50px" }}>
                            {
                                notification.loading ? <div className='loading__container'>
                                    <img style={{ width: "70px", margin: "50px auto" }} src={Loading} alt="notification-loading">
                                    </img>
                                </div>
                                    :
                                    notification.data.length === 0 ?
                                        <h2 style={{ padding: "10px" }}>🎉 No notification! </h2>
                                        :
                                        <ul className="notification__list">
                                            {
                                                notification.data.map((msg, index) => {
                                                    return <li key={index}>
                                                        <Link to={msg.url} className="notify__card" onClick={() => handleisReadNotify(msg)}>
                                                            <div className="notify__card-wrapper">
                                                                <img className="notify__user-image" src={msg.user.avatar} alt="user-notify" >
                                                                </img>
                                                                <div className="notify__wrapper">
                                                                    <div className="notify__user-infor">
                                                                        <div className="notify__user-infor-wrapper">
                                                                            <h2>{msg.user.username} <p>{msg.text} <span>&#8226;</span> <span>{moment(msg.createdAt).fromNow()}</span></p></h2>

                                                                        </div>
                                                                        {
                                                                            <span className={msg.isRead ? "notify__isRead isRead" : "notify__isRead NotRead"}>

                                                                            </span>
                                                                        }
                                                                    </div>
                                                                    <div className="notify__content">
                                                                        <p>
                                                                            {msg.content && msg.content.slice(0, 60) + "..."}
                                                                        </p>
                                                                        {
                                                                            msg.image &&
                                                                            <img alt="image__post" src={msg.image} className="notify__content-image">
                                                                            </img>
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    </li>
                                                })
                                            }
                                            <div className="notify__delete-all" onClick={deleteAllNotification}>
                                                Delete all
                                            </div>
                                        </ul>

                            }

                        </div>
                    </div>
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

export default Notifications
