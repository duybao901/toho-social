import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import {
    FacebookShareButton, FacebookIcon,
    PinterestShareButton, PinterestIcon,
    TelegramShareButton, TelegramIcon,
    TwitterShareButton, TwitterIcon,
    LinkedinShareButton, LinkedinIcon,
} from "react-share";

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    paper: {
        height: "150px",
        width: "300px",
        borderRadius: "15px",
        padding: '2px',
        outline: 'none',
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
    },
}));

export default function ShareModal({ url, open, handleClose }) {
    const classes = useStyles();

    return (
        <div>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <div className={classes.paper}>
                        <div className="modal__heading editprofile__heading">
                            <div className='modal__heading-left'>
                                <h2 className='modal__title'>
                                    Share
                                </h2>
                            </div>
                            <div className='modal__heading-right'>
                                <div className="modal__heading-close" style={{ marginRight: '0px' }} onClick={handleClose}>
                                    <i className='bx bx-x'></i>
                                </div>
                            </div>
                        </div>
                        <div className="share__body">
                            <FacebookShareButton url={url}>
                                <FacebookIcon size={40} round={true} />
                            </FacebookShareButton>
                            <TwitterShareButton url={url}>
                                <TwitterIcon size={40} round={true} />
                            </TwitterShareButton>
                            <PinterestShareButton url={url}>
                                <PinterestIcon size={40} round={true} />
                            </PinterestShareButton>
                            <TelegramShareButton url={url}>
                                <TelegramIcon size={40} round={true} />
                            </TelegramShareButton>
                            <LinkedinShareButton url={url}>
                                <LinkedinIcon size={40} round={true} />
                            </LinkedinShareButton>
                        </div>
                    </div>
                </Fade>
            </Modal>
        </div>
    );
}
