import React, { useState } from 'react'
import Carousel from '../Carousel'
function CardBody({ post, id }) {
    const [readMore, setReadMore] = useState(false);



    return (
        <div className="card__body">
            {post.content.length > 0 && <div className="card__body-content">
                <span>
                    {
                        post.content.length < 80 ?
                            post.content + ' '
                            : readMore ? post.content + ' ' : post.content.slice(0, 80) + '... '
                    }
                </span>
                {
                    post.content.length > 80 &&
                    <span className="readMore" onClick={() => setReadMore(!readMore)}>
                        {readMore ? "Hide content" : "Read more"}
                    </span>
                }
            </div>}
            <div className="card__body-carousel">
                {post.images.length > 0 && <Carousel images={post.images} id={post._id} />}
            </div>
        </div>
    )
}

export default CardBody
