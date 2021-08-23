import React, { useState, useEffect, useRef } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { getDataAPI } from '../../utils/fetchData'
import { useDispatch, useSelector } from 'react-redux'
import * as GLOBLETYPES from '../../redux/constants/index'
import Loading from '../../components/norify/globle_loading.gif'
import { getConversation } from '../../redux/actions/messageAction'
import * as MESSAGE_TYPES from '../../redux/constants/message';
import UserCardMessage from '../UserCardMessage'


function LeftSide() {
    const history = useHistory();
    const [search, setSearch] = useState('');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const { auth, message, online } = useSelector(state => state);
    const refMoreUserCard = useRef();
    const [page, setPage] = useState(0)

    function handleChange(e) {
        setSearch(e.target.value.trim().replace(/ /g, ''))
    }

    function hanldeSubmit(e) {
        e.preventDefault();
        setLoading(true);
        getDataAPI(`search?username=${search}`, auth.token)
            .then(res => {
                setUsers(res.data.users);
                setLoading(false);
            })
            .catch(err => {
                setLoading(false);
                dispatch({ type: GLOBLETYPES.NOTIFY, payload: { err: err.response.data.msg } })
            })
    }

    function clearUsers() {
        setSearch('');
        setUsers([]);
    }

    function addUserMessage(user) {
        setSearch('');
        setUsers([]);
        dispatch({ type: MESSAGE_TYPES.ADD_USER, payload: { ...user, text: '', media: [] } })
        return history.push(`/message/${user._id}`)
    }

    useEffect(() => {
        if (message.firstLoad) return;
        dispatch(getConversation({ auth }))
    }, [dispatch, message.firstLoad, auth])

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                setPage(p => p + 1);
            }
        })
        observer.observe(refMoreUserCard.current)
    }, [setPage])

    useEffect(() => {
        if (message.resultUsers >= (page - 1) * 10 && page > 1) {
            dispatch(getConversation({ auth, page }))
        }
    }, [message.resultUsers, page, auth, dispatch])

    useEffect(() => {
        if (message.firstLoad) dispatch({ type: MESSAGE_TYPES.CHECK_USER_ONLINE_OFFLINE, payload: online.data });
    }, [online.data, message.firstLoad, dispatch])


    return (
        <div className="message__left-side">
            <div className="message__header message__header">
                <div className='message__header-right'>
                    <h2 style={{ cursor: 'pointer' }} className="message__header-title" onClick={() => window.scrollTo({ top: 0 })}>
                        Messages
                    </h2>
                </div>
            </div>
            <div className="search__wrapper">
                <form onSubmit={hanldeSubmit}>
                    <i className='bx bx-search search__form-icon'></i>
                    <input placeholder="Search people" type='text' onChange={handleChange} value={search} name='search'></input>
                    {!loading ? <div onClick={clearUsers} className={search ? 'search__form-clear active' : "search__form-clear"}>
                        <i className='bx bx-x'></i>
                    </div> : <img style={{ width: '30px', height: "30px" }} src={Loading} alt='loadingusers'>
                    </img>}
                </form>
                <ul className='message__users-list'>

                    {
                        users.length > 0 && users.map((user, index) => {
                            if (user._id !== auth.user._id) {
                                return <li key={index} onClick={() => addUserMessage(user)}>
                                    <Link to={`/ message / ${user._id}`}>
                                        <img src={user.avatar} alt='searchavatar'>
                                        </img>
                                        <div className="search__users-infor">
                                            <span style={{ fontSize: '14px', fontWeight: "700" }}>{user.fullname}</span>
                                            <span style={{ fontSize: '14px', fontWeight: "400" }}>@{user.username}</span>
                                        </div>
                                    </Link>
                                </li>
                            } else {
                                return ""
                            }
                        })
                    }
                </ul>

                <div className="message_card-list">
                    {
                        message.users.length > 0 && message.users.map(user => {
                            return <UserCardMessage user={user} key={user._id} />
                        })
                    }
                    <div style={{ opacity: 0, backgroundColor: 'red' }} ref={refMoreUserCard}>
                        loadmore
                    </div>
                </div>



            </div>
        </div>
    )
}

export default LeftSide
