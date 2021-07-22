import React from 'react'

function LikeButton({ isLike, hanldeLike, hanldeUnLike, size }) {
    return (
        <>
            {!isLike ?
                <i style={{ fontSize: size && `${size}rem`, cursor: 'pointer' }} className='bx bx-heart' onClick={hanldeLike}></i>
                : <i style={{ fontSize: size && `${size}rem`, cursor: 'pointer', color: '#e0245e'}} className='bx bxs-heart card__post--islike' onClick={hanldeUnLike}></i>
            }
        </>
    )
}

export default LikeButton
