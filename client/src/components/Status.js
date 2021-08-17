import React, { useState, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import * as GLOBLE_TYPES from '../redux/constants/index'
import * as POST_TYPES from '../redux/constants/post'
import { createPost, updatePost } from '../redux/actions/postAction'
import Icons from './Icons'

function Status({ setOpenStatus }) {
    const { auth, status, socket } = useSelector(state => state);
    const [content, setContent] = useState('');
    const [images, setImages] = useState([]);
    const [stream, setStream] = useState(false);
    const [tracks, setTracks] = useState('');

    const refVideo = useRef();
    const refCanvas = useRef();
    const refImages = useRef();

    const dispatch = useDispatch();

    // Auto scroll when add image
    useEffect(() => {
        if (refImages.current) {
            refImages.current.scrollTo({
                top: refImages.current.scrollHeight,
                behavior: 'smooth'
            })
        }
    }, [refImages.current && refImages.current.scrollHeight])

    // Edit Post
    useEffect(() => {
        if (status.onEdit) {
            setContent(status.content);
            setImages(status.images);
        } else {
            setContent('');
            setImages([]);
            setStream(false);
        }
    }, [status])

    function handleUploadImages(e) {
        let files = [...e.target.files];
        let err = "";
        let newImages = [];
        files.forEach(file => {
            if (!file) {
                return err = "File does not exist."
            }
            if (file.size > 1024 * 1024 * 5) {
                return err = "The File/Video largest is 5mb."
            }
            return newImages.push(file);
        });
        if (err) {
            return dispatch({ type: GLOBLE_TYPES.NOTIFY, payload: { err } });
        }
        setImages([...images, ...newImages]);
    }

    function handleRemoveImageItem(index) {
        let newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);
    }

    function hanldeStream() {
        setStream(true);
        // Access Camera
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(mediaStream => {
                    refVideo.current.srcObject = mediaStream;
                    refVideo.current.play();
                    const track = mediaStream.getTracks()
                    setTracks(track[0]);
                }).catch(error =>
                    dispatch({ type: GLOBLE_TYPES.NOTIFY, payload: { err: error } })
                );
        }
    }

    function hanldeCapture() {
        const width = refVideo.current.clientWidth;
        const height = refVideo.current.clientHeight;

        refCanvas.current.setAttribute('width', width);
        refCanvas.current.setAttribute('height', height);

        const ctx = refCanvas.current.getContext('2d');
        ctx.drawImage(refVideo.current, 0, 0, width, height);
        let URL = refCanvas.current.toDataURL();
        setImages([...images, { camera: URL }]);
    }

    function hanldeStopStream() {
        if (tracks) {
            tracks.stop();
            setStream(false);
        }
    }

    function hanldeSubmit(e) {
        e.preventDefault();
        if (images.length === 0) {
            return dispatch({ type: GLOBLE_TYPES.NOTIFY, payload: { err: "Please add your photo." } });
        }
        if (status.onEdit) {
            dispatch({ type: POST_TYPES.STATUS, payload: { onEdit: false } })
            setContent('');
            setImages([]);
            setStream(false);
            if (setOpenStatus) setOpenStatus(false); // close modal
            dispatch(updatePost({ content, images, auth, status }))
        } else {
            dispatch({ type: POST_TYPES.STATUS, payload: { onEdit: false } })
            setContent('');
            setImages([]);
            setStream(false);
            if (setOpenStatus) setOpenStatus(false); // close modal
            dispatch(createPost({ content, images, auth, socket }))
        }

    }

    function imagesShow(src) {
        return <img src={src} alt='show__images'>
        </img>
    }
    function videosShow(src) {
        return <video
            src={src}
            controls
            alt='show__images'>
        </video>
    }

    return (
        <div className="status__container">
            <div className="status__avatar">
                <img src={auth && auth.user.avatar} alt='useravatar'>
                </img>
            </div>
            <div className='status__body'>
                <div className='status__body-wrapper'>
                    <div className="status__form">
                        <textarea
                            placeholder="What's happening?"
                            className='status__input'
                            rows={3}
                            cols={10}
                            value={content}
                            onChange={e => setContent(e.target.value)}
                        />
                    </div>
                    {
                        <div ref={refImages} className="show__images">
                            {
                                images.map((image, index) => {
                                    return <div key={index} className="show__images-item">
                                        {
                                            image.camera ? imagesShow(image.camera)
                                                : image.url
                                                    ?
                                                    <>
                                                        {
                                                            image.url.match(/video/i) ?
                                                                videosShow(image.url) : imagesShow(image.url)
                                                        }
                                                    </> :
                                                    <>
                                                        {
                                                            image.type.match(/video/i) ?
                                                                videosShow(URL.createObjectURL(image)) : imagesShow(URL.createObjectURL(image))
                                                        }
                                                    </>

                                        }
                                        <span onClick={() => handleRemoveImageItem(index)} className="show__images-item-remove">
                                            <i className='bx bx-x'></i>
                                        </span>
                                    </div>
                                })
                            }
                        </div>
                    }

                    {
                        stream && <div className='status__stream'>
                            <video autoPlay muted ref={refVideo} width='100' height="100"></video>

                            <div className="status__steam-control">
                                {stream && <span style={{ marginBottom: "10px" }} onClick={hanldeCapture} className="status__stream-close">
                                    <i className='bx bx-camera'></i>
                                </span>}
                                <span onClick={hanldeStopStream} className="status__stream-close">
                                    <i className='bx bx-x'></i>
                                </span>
                            </div>

                            <canvas style={{ display: "none" }} ref={refCanvas}></canvas>

                        </div>
                    }


                    <div className="status__bottom">
                        <div className="status__bottom-left">
                            {
                                !stream ? <React.Fragment>
                                    <i className='bx bx-camera' onClick={hanldeStream}></i>
                                    <div className="status__file-upload">
                                        <input onChange={handleUploadImages} type='file' id="file" name='file' multiple accept="image/*,video/*" />
                                        <i className='bx bx-image'></i>
                                    </div>
                                    <Icons setContent={setContent} content={content} />

                                </React.Fragment> : ""
                            }
                        </div>
                        <div>
                            <button className="status__button" onClick={hanldeSubmit}>
                                post
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Status
