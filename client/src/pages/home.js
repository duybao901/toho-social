import React from 'react'
import Search from '../components/search/Search'
import Status from '../components/Status'
import HomePosts from '../components/home/HomePosts'
import Suggestion from '../components/Suggestion'
function Home() {
    return (
        <div className="main__container-right">
            <div className="row">
                <div className="col col-sm-12 col-md-12 col-lg-7">
                    <div className="main__content">
                        <div className="home__header main__header">
                            <div className='main__header-right'>
                                <h2 style={{ cursor: 'pointer' }} className="main__header-title" onClick={() => window.scrollTo({ top: 0 })}>
                                    Home
                                </h2>
                            </div>                          
                        </div>

                        <div className="home__status">
                            <Status />
                        </div>
                        <div style={{ marginTop: '50px' }}>

                        </div>
                        <div className="home__posts">
                            <HomePosts />
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

export default Home
