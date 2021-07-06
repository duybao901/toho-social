import React, { useState, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'

import Slider from '@material-ui/core/Slider'
import Cropper from 'react-easy-crop'

import * as GLOBLE_TYPES from '../../redux/constants/index'

function EditMedia() {
    const dispatch = useDispatch();
    const { show, imageURL, imageId, aspectX, aspectY } = useSelector(state => state.editMedia)

    const [croppedArea, setCropperArae] = useState({});
    const [croppedAreaPixels, setCropperAreaPixels] = useState({});

    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        console.log(croppedAreaPixels);
        setCropperArae(croppedArea);
        setCropperAreaPixels(croppedAreaPixels)
    }, [])

    const handleRemoveAvatar = async (e) => {
        try {
            dispatch({ type: "SHOW_MEDIA", payload: {} })
            const res = await axios.post('/api/delete_image', { public_id: imageId })
        } catch (error) {
            dispatch({ type: GLOBLE_TYPES.NOTIFY, payload: { err: error.response.data.msg } })
        }
    }

    const hanldeChangeImage = async () => {
        try {
            // dispatch({ type: "SHOW_MEDIA", payload: {} })
            console.log(imageURL)
            const newImageURL = imageURL.replace('upload/', `upload/c_crop,h_${croppedAreaPixels.height},w_${croppedAreaPixels.width},x_${croppedAreaPixels.x},y_${croppedAreaPixels.y}/`);

            console.log(newImageURL);
            // const res = await axios.post('/api/delete_image', { public_id: imageId })
        } catch (error) {
            dispatch({ type: GLOBLE_TYPES.NOTIFY, payload: { err: error.response.data.msg } })
        }
    }

    return show ? <div className="edit-media">
        <div className='edit-media__container' >
            <div className="modal__heading editprofile__heading">
                <div className='modal__heading-left'>
                    <div className="modal__heading-close" onClick={handleRemoveAvatar}>
                        <i className='bx bx-left-arrow-alt' ></i>
                    </div>
                    <h2>
                        Edit Media
                    </h2>
                </div>
                <div className='modal__heading-right'>
                    <button className='modal__save-btn' onClick={hanldeChangeImage}>
                        Apply
                    </button>
                </div>
            </div>
            <div className="crop-container">
                <Cropper
                    image={imageURL ? imageURL : ""}
                    crop={crop}
                    zoom={zoom}
                    aspect={aspectX || 1 / aspectY || 1}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                />
            </div>
            <div className="controls">
                <i className='bx bx-zoom-out'></i>
                <Slider
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    aria-labelledby="Zoom"
                    onChange={(e, zoom) => setZoom(zoom)}
                    classes={{ root: 'slider' }}
                />
                <i className='bx bx-zoom-in' ></i>
            </div>
        </div >
    </div> : " "

}

export default EditMedia
