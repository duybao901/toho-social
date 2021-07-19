import React from 'react'

function LikeButton({ isLike, hanldeLike, hanldeUnLike }) {
    return (
        <>
            {!isLike ?
                <i className='bx bx-heart' onClick={hanldeLike}></i>
                : <i className='bx bxs-heart card__post--islike' onClick={hanldeUnLike}></i>}
        </>
    )
}

export default LikeButton
