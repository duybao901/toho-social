import React from 'react'
import GlobleLoading from './globle_loading.gif'
function Loading() {
    return (
        <div className='globle__loading'>
            <div className='globle__loading-container'>
                <img style={{width: '100px'}} src={GlobleLoading} alt='loading'></img>
                <p>Loading...</p>
            </div>
        </div>
    )
}

export default Loading
