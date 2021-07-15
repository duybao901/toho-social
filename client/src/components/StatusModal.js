import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

import Status from './Status';

const useStyles = makeStyles((theme) => ({
    modal: {
        // display: 'flex',
        // justifyContent: 'center',
    },
    paper: {
        maxHeight: "660px",
        margin: "50px auto 0px",
        width: "600px",
        borderRadius: "15px",
        padding: '2px',
        outline: 'none',
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        overflowY: 'auto',
    },
}));

export default function StatusModal({ open, handleClose }) {
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
                                <div className="modal__heading-close" onClick={handleClose}>
                                    <i className='bx bx-x'></i>
                                </div>
                            </div>
                        </div>
                        <Status />
                    </div>
                </Fade>
            </Modal>
        </div>
    );
}
