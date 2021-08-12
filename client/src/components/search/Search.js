import React, { useState } from 'react'
import { getDataAPI } from '../../utils/fetchData'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import * as GLOBLETYPES from '../../redux/constants/index'
import Loading from '../../components/norify/globle_loading.gif'


function Search() {

    const [search, setSearch] = useState('');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const { auth } = useSelector(state => state);

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

    return (
        <div className="search">
            <div className="search__box">
                <div className='search__form'>
                    <form onSubmit={hanldeSubmit}>
                        <i className='bx bx-search search__form-icon'></i>
                        <input placeholder="Search" type='text' onChange={handleChange} value={search} name='search'></input>
                        {!loading ? <div onClick={clearUsers} className={search ? 'search__form-clear active' : "search__form-clear"}>
                            <i className='bx bx-x'></i>
                        </div> : <img style={{ width: '30px', height: "30px" }} src={Loading} alt='loadingusers'>
                        </img>}
                    </form>
                </div>
                <div className='search__users'>
                    <ul className='search__users-list'>
                        {users.length > 0 && users.map((user, index) => {
                            return <li key={index} onClick={clearUsers}>
                                <Link to={`/profile/${user._id}`}>
                                    <img src={user.avatar} alt='searchavatar'>
                                    </img>
                                    <div className="search__users-infor">
                                        <span style={{ fontSize: '14px', fontWeight: "700" }}>{user.fullname}</span>
                                        <span style={{ fontSize: '14px', fontWeight: "400" }}>@{user.username}</span>
                                    </div>
                                </Link>
                            </li>
                        })}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Search
