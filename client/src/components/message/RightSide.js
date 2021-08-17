import React, { useState, useEffect, useRef } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import MessageDisplay from './MessageDisplay'
import * as GLOBLE_TYPES from '../../redux/constants/index'
import { imagesUpload } from '../../utils/imageUpload';
import { addMessage, getMessages } from '../../redux/actions/messageAction'
import LoadingImage from '../../images/globle_loading.gif'
import Icons from '../../components/Icons'
import * as MESSAGE_TYPES from '../../redux/constants/message'
function RightSide() {
    const dispatch = useDispatch();
    const history = useHistory();
    const { auth, message, socket } = useSelector(state => state);
    const { id } = useParams();
    const [user, setUser] = useState({});
    const [text, setText] = useState('');
    const [images, setImages] = useState([]);
    const [loadimages, setLoadImages] = useState(false);
    const [page, setPage] = useState(0);

    const refChatDisplay = useRef();
    const pageEnd = useRef();
    const [data, setData] = useState([]);


    useEffect(() => {
        const newUser = message.users.find(user => user._id === id);
        if (newUser) {
            setUser(newUser);
        } else {
            history.push('/message');
        }
    }, [message.users, id, history])


    useEffect(() => {
        if (id) {
            const getMessagesData = async () => {
                dispatch({ type: MESSAGE_TYPES.GET_MESSAGES, payload: { messages: [] } });
                setPage(0);
                await dispatch(getMessages({ id, auth }))
                if (refChatDisplay.current) {
                    refChatDisplay.current.scrollIntoView({ behavior: 'smooth', block: 'end' })

                }
            }
            getMessagesData();
        }
    }, [id, dispatch, auth])

    useEffect(() => {
        if (refChatDisplay.current) {
            refChatDisplay.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
        }
    }, [text])

    // Set Data
    useEffect(() => {
        const newData = message.data.filter((item) => {
            return item.sender === auth.user._id || item.sender === id
        });
        setData(newData);
    }, [message.data, auth.user._id, id]);

    const onSubmit = async (e) => {
        e.preventDefault();
        if (text.trim() === '' && images.length === 0) return;
        setText('');
        setImages([]);

        let newArray = [];
        if (images.length > 0) {
            setLoadImages(true);
            newArray = await imagesUpload(images);
        }

        const msg = {
            sender: auth.user._id,
            recipient: id,
            text,
            media: newArray,
            createdAt: new Date().toISOString(),
        }

        refChatDisplay.current.scrollIntoView({ behavior: 'smooth' })

        await dispatch(addMessage({ msg, auth, socket }))

        if (refChatDisplay.current) {
            refChatDisplay.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
        }


        setLoadImages(false);

    }

    function hanldeChange(e) {
        setText(e.target.value)
    }

    function handleUploadImages(e) {
        let files = [...e.target.files];
        let err = "";
        let newMedia = [];
        files.forEach(file => {
            if (!file) {
                return err = "File does not exist."
            }
            if (file.size > 1024 * 1024 * 5) {
                return err = "The File/Video largest is 5mb."
            }
            return newMedia.push(file);
        });
        if (err) {
            return dispatch({ type: GLOBLE_TYPES.NOTIFY, payload: { err } });
        }
        setImages([...images, ...newMedia]);
    }

    function removeImage(index) {
        const newArray = [...images];
        newArray.splice(index, 1);
        setImages(newArray);
    }

    // load more
    useEffect(() => {
        const observer = new IntersectionObserver(entries => {

            if (entries[0].isIntersecting) {
                setPage(page => page + 1)
            }
        }, {
            threshold: 0.1
        })

        observer.observe(pageEnd.current)
    }, [setPage])

    // Get more message
    useEffect(() => {

        if (message.resultData >= (page - 1) * 9 && page > 1) {
            dispatch(getMessages({ id, auth, page }))
        }
    }, [page, message.resultData, id, auth])
    return (
        <div className="message__right-chat">
            <div className="message__box">
                <div className="message__box-header">
                    <img style={{ width: '40px' }} src={user.avatar} alt="user_avatar">
                    </img>
                    <div className="search__users-infor">
                        <span style={{ fontSize: '14px', fontWeight: "700" }}>{user.fullname}</span>
                        <span style={{ fontSize: '14px', fontWeight: "400" }}>@{user.username}</span>
                    </div>
                </div>

                <div className={images.length > 0 ? "chat__container active" : "chat__container"}>
                    {
                        <div className="chat_display" ref={refChatDisplay}>
                            <button style={{ marginTop: '-15px', opacity: 0, display: 'flex' }} ref={pageEnd}>
                                Load more
                            </button>
                            {
                                data.map((msg, index) => {
                                    return <div key={index}>
                                        {
                                            msg.sender !== auth.user._id && <div className="chat_row orther_message">
                                                <MessageDisplay user={user} msg={msg} />
                                            </div>
                                        }
                                        {
                                            msg.sender === auth.user._id ? <div className="chat_row you_message">
                                                <MessageDisplay user={auth.user} msg={msg} />
                                            </div> : ""
                                        }
                                    </div>
                                })
                            }

                            {
                                loadimages && <div className="chat_row">
                                    <img style={{ width: "50px", marginLeft: 'auto' }} src={LoadingImage} alt="loadimages">
                                    </img>
                                </div>
                            }
                        </div>
                    }

                </div>



                {
                    images.length > 0 && <div className="message__media">
                        {
                            images.map((image, index) => {
                                return image.type.match(/video/i) ?
                                    <div className="message__media-img">
                                        <i className='bx bx-x' onClick={() => removeImage(index)}></i>
                                        <video key={index} controls src={URL.createObjectURL(image)} alt="message_img" />
                                    </div> :
                                    <div className="message__media-img">
                                        <i className='bx bx-x' onClick={() => removeImage(index)}></i>
                                        <img key={index} src={URL.createObjectURL(image)} alt="message_media"></img>
                                    </div>
                            })
                        }
                    </div>
                }


                <form className="chat_input" onSubmit={onSubmit}>
                    <div className="message__file-upload">
                        <i className='bx bx-image-alt'></i>
                        <input onChange={handleUploadImages} type='file' id="file_upload" name='file' multiple accept="image/*,video/*" />
                    </div>
                    <Icons setContent={setText} content={text} className="chat_icons" />
                    <input id='text' type="text"
                        name="text"
                        placeholder="Enter your message..."
                        value={text}
                        onChange={hanldeChange}
                    ></input>

                    <button type="submit" disabled={text || images.length > 0 ? false : true}>
                        <i className='bx bx-send' style={{ opacity: text || images.length > 0 ? "1" : '0.2' }}></i>
                    </button>
                </form>
            </div>
        </div >
    )
}

export default RightSide
