import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import Infor from '../../components/profile/Infor'
import Posts from '../../components/profile/Posts'
import Search from '../../components/search/Search'
import Loading from '../../images/globle_loading.gif'
import * as profileAction from '../../redux/actions/profileAction'
import Suggestion from '../../components/Suggestion'

const Profile = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const { profile, auth } = useSelector(state => state);

    useEffect(() => {
        if (profile.ids.every(item => item !== id)) {
            dispatch(profileAction.getProfileUser({ id, auth }));
        }
    }, [id, auth, dispatch, profile.ids])

    return (
        <div className="main__container-right profile">
            <div className="row">
                <div className="col col-sm-12 col-md-12 col-lg-7 home__content">
                    <div className="profile__container">
                        {
                            profile.loading ? <div style={{ width: "100%" }} className="loading__wrapper">
                                <img style={{ width: "100px" }} src={Loading} alt='imgloading' />
                            </div> : <div>
                                <Infor id={id} auth={auth} profile={profile} dispatch={dispatch} />
                                <Posts id={id} auth={auth} profile={profile} dispatch={dispatch} />
                            </div>
                        }
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

export default Profile