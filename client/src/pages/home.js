import React from 'react'
import Search from '../components/search/Search'
import Status from '../components/Status'
import HomePosts from '../components/home/HomePosts'
function Home() {
    return (
        <div className="main__container-right">
            <div className="row">
                <div className="col col-sm-12 col-md-12 col-lg-7 home__content">
                    <div className="main__content">
                        <div className="home__header main__header">
                            <div className='main__header-right'>
                                <h2 style={{ cursor: 'pointer' }} className="main__header-title" onClick={() => window.scrollTo({ top: 0 })}>
                                    Home
                                </h2>
                            </div>
                            <div className="main__header-left">

                            </div>
                        </div>

                        <div className="home__status">
                            <Status />
                        </div>
                        <div className="indicator" style={{ marginTop: '50px' }}>

                        </div>
                        <div className="home__posts">
                            <HomePosts />
                        </div>
                    </div>
                </div>
                <div className="col-lg-5 home__left main__left">
                    <div className="home__search">
                        <div className="home__search-container">
                            <Search />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home
