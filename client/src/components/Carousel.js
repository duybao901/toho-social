import React from 'react'

function Carousel({ images, id, isDetailPost }) {
    function isActive(index) {
        if (index === 0) {
            return 'active'
        }
    }
    return (
        <div className="carousel">
            <div id={`images${id}`} className="carousel slide" data-ride="carousel">
                <ol className="carousel-indicators">
                    {images.map((image, index) => {
                        return <li style={{ zIndex: "15" }} key={index} data-target={`#images${id}`} data-slide-to={index} className={isActive(index)}></li>
                    })}
                </ol>
                <div className="carousel-inner">
                    {
                        images.map((img, index) => {
                            return <div key={index} className={`carousel-item ${isActive(index)}`}>
                                {
                                    img.url.match(/video/i) ? <video controls style={{ position: 'relative', zIndex: "16", height: "520px", objectFit: isDetailPost ? "contain" : "cover" }} src={img.url} className="d-block w-100" alt={img.url} /> :
                                        <img style={{ height: "520px", objectFit: isDetailPost ? "contain" : "cover" }} src={img.url} className="d-block w-100" alt={img.url} />
                                }
                            </div>
                        })
                    }
                    <a style={{ height: "85%", zIndex: "17" }} className="carousel-control-prev" href={`#images${id}`} role="button" data-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true" ></span>
                        <span className="sr-only">Previous</span>
                    </a>
                    <a style={{ height: "85%", zIndex: "17" }} className="carousel-control-next" href={`#images${id}`} role="button" data-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="sr-only">Next</span>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default Carousel
