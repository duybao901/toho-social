import React, { useState, useEffect, useRef } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import MessageDisplay from './MessageDisplay'
import * as GLOBLE_TYPES from '../../redux/constants/index'
import * as CALL_TYPES from '../../redux/constants/call'
import { imagesUpload } from '../../utils/imageUpload';
import { addMessage, getMessages, updateMessages, deleteConversation } from '../../redux/actions/messageAction'
import LoadingImage from '../../images/globle_loading.gif'
import Icons from '../../components/Icons'

function RightSide() {
    const dispatch = useDispatch();
    const history = useHistory();
    const { auth, message, socket, peer } = useSelector(state => state);
    const { id } = useParams();
    const [user, setUser] = useState({});
    const [text, setText] = useState('');
    const [images, setImages] = useState([]);
    const [loadimages, setLoadImages] = useState(false);

    const refChatDisplay = useRef();
    const refChatContainer = useRef();

    const pageEnd = useRef();
    const [data, setData] = useState([]);
    const [result, setResult] = useState(0);
    const [page, setPage] = useState(1);
    const [isLoadMore, setIsLoadMore] = useState(0);

    // get Users Card
    useEffect(() => {
        if (id && message.users.length > 0) {
            const newUser = message.users.find(user => user._id === id);
            if (newUser) {
                setUser(newUser);
                setTimeout(() => {
                    refChatDisplay.current && refChatDisplay.current.scrollIntoView({ block: 'end' })
                }, 0)
                setIsLoadMore(1);
            } else {
                return history.push('/message');
            }

        }
    }, [message.users, id, history])

    // Get Messages
    useEffect(() => {
        const getMessagesData = async () => {
            if (message.data.every(item => item._id !== id)) {
                await dispatch(getMessages({ id, auth }))
                if (refChatDisplay.current) {
                    setTimeout(() => {
                        refChatDisplay.current && refChatDisplay.current.scrollIntoView({ block: 'end' })
                    }, 0)
                }
            }
        }
        getMessagesData();
    }, [id, dispatch, auth, message.data])

    // Chat then scroll bottom
    useEffect(() => {
        if (refChatDisplay.current) {
            refChatDisplay.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
        }
    }, [text])

    // Set Data
    useEffect(() => {
        let newData = message.data.find((item) => {
            return item._id === id;
        });;
        if (newData) {
            setData(newData.messages);
            setResult(newData.result);
            setPage(newData.page);
            setIsLoadMore(1);
        }
    }, [message.data, id]);

    // load more
    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                setIsLoadMore(p => p + 1)
            }
        }, {
            threshold: 0.1
        })

        observer.observe(pageEnd.current)
    }, [setIsLoadMore])

    // Get more message
    useEffect(() => {
        const updateMessageMore = async () => {
            if (isLoadMore > 1) {
                if (result >= page * 9) {
                    await dispatch(updateMessages({ id, auth, page: page + 1 }))
                    refChatContainer.current && refChatContainer.current.scrollTo(0, refChatContainer.current.scrollHeight / 2.5)
                    setIsLoadMore(1)
                }
            }
        }
        updateMessageMore();
    }, [isLoadMore, dispatch, page, id, auth, result, refChatDisplay.current])

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
        setLoadImages(false);

        await dispatch(addMessage({ msg, auth, socket }))

        if (refChatDisplay.current) {
            setTimeout(() => {
                refChatDisplay.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
            }, 0)
        }


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

    function handleDeleteConversation() {
        if (window.confirm("Do you want to delete this conversation?")) {
            dispatch(deleteConversation({ id, auth }));
            history.push('/message');
        }
    }

    function hanldeCall(video) {
        const { _id, username, fullname, avatar } = user;

        const msg = {
            recipient: _id,
            sender: auth.user._id,
            username, fullname, avatar,
            video
        }

        dispatch({ type: CALL_TYPES.CALL, payload: msg });
    }

    function hanldeCallUser(video) {
        const { _id, username, fullname, avatar } = auth.user;

        const msg = {
            recipient: user._id,
            sender: _id,
            username, fullname, avatar,
            video
        }

        if (peer.open) msg.peer_id = peer._id;

        socket.emit("callUser", msg);

    }

    function hanldeCallAudio(video) {
        hanldeCall(video)
        hanldeCallUser(video)
    }

    function hanldeCallVideo(video) {
        hanldeCall(video)
        hanldeCallUser(video)
    }

    return (
        <div className="message__right-chat">
            <div className="message__box">
                <div className="message__box-header">
                    <div className="message__box-header-left">
                        {
                            user.avatar && <img style={{ width: '40px' }} src={user.avatar} alt="user_avatar">
                            </img>
                        }
                        <div className="message__users-infor">
                            <span style={{ fontSize: '14px', fontWeight: "700" }}>{user.fullname}</span>
                            <span style={{ fontSize: '14px', fontWeight: "400" }}>{user.username && `@${user.username}`}</span>
                        </div>
                    </div>
                    {
                        Object.keys(user).length > 0 && <div className="message__box-header-right">
                            <i className='bx bxs-phone' onClick={() => hanldeCallAudio(false)}></i>
                            <i className='bx bxs-video' onClick={() => hanldeCallVideo(true)}></i>
                            <i className='bx bxs-trash' onClick={handleDeleteConversation}></i>
                        </div>
                    }
                </div>

                <div ref={refChatContainer} style={{ opacity: message.loadingMessages ? 0.5 : 1 }} className={images.length > 0 ? "chat__container active" : "chat__container"}>

                    {
                        <div className="chat_display" ref={refChatDisplay}>
                            <button style={{ marginTop: '-10px', opacity: 0, display: 'flex' }} ref={pageEnd}>
                                Load more
                            </button>
                            {
                                data.map((msg, index) => {
                                    return <div key={index}>
                                        {
                                            msg.sender !== auth.user._id && <div className="chat_row orther_message">
                                                <MessageDisplay user={user} msg={msg} data={data} />
                                            </div>
                                        }
                                        {
                                            msg.sender === auth.user._id ? <div className="chat_row you_message">
                                                <MessageDisplay user={auth.user} msg={msg} data={data} />
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
