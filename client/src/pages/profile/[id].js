import React from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

import Infor from '../../components/profile/Infor'
import Post from '../../components/profile/Post'

import Loading from '../../images/globle_loading.gif'

const Profile = () => {
    const { id } = useParams();
    const { profile } = useSelector(state => state);
    return (
        <div className="main__container-right profile">
            {profile.loading ? <div style={{ width: "600px" }} className="loading__wrapper">
                <img style={{width:"100px"}} src={Loading} alt='imgloading' />
            </div> : <Infor id={id} />}
            <Post />
        </div>
    )
}

export default Profile