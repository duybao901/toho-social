import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getDataAPI } from '../../utils/fetchData'
import { useDispatch, useSelector } from 'react-redux'
import * as GLOBLETYPES from '../../redux/constants/index'
import Loading from '../../components/norify/globle_loading.gif'
import { addUser } from '../../redux/actions/messageAction'


function LeftSide() {
    const { id } = useParams();
    const [search, setSearch] = useState('');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const { auth, message } = useSelector(state => state);


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
        dispatch(addUser(user, message));
    }

    function isActive(user) {
        return (user._id === id) ? "active" : ""
    }

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
                                    <Link to={`/message/${user._id}`}>
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
                {
                    message.users.length > 0 && message.users.map(user => {
                        return <Link key={user._id} className={`user_message ${isActive(user)}`} to={`/message/${user._id}`}>
                            <img style={{ width: '40px' }} src={user.avatar} alt="user_avatar">
                            </img>
                            <div className="search__users-infor">
                                <span style={{ fontSize: '14px', fontWeight: "700" }}>{user.fullname}</span>
                                <span style={{ fontSize: '14px', fontWeight: "400" }}>@{user.username}</span>
                            </div>
                            <i className='bx bxs-circle'></i>
                        </Link>
                    })
                }


            </div>
        </div>
    )
}

export default LeftSide
