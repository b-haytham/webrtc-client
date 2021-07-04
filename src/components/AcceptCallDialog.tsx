import React, { useState } from "react";

import { TransitionProps } from "@material-ui/core/transitions";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    Fab,
    Slide,
} from "@material-ui/core";

import PhoneIcon from "@material-ui/icons/Phone";
import PhoneDisabledIcon from "@material-ui/icons/PhoneDisabled";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children?: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

interface AcceptCallDialogProps {
    open: boolean;
    handleClose(): void;
    onAccept(): void;
    onReject(): void;
    caller?: any;
}

const AcceptCallDialog: React.FC<AcceptCallDialogProps> = ({
    open,
    handleClose,
    onAccept,
    onReject,
    caller,
}) => {
    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-describedby="alert-dialog-slide-description"
            sx={{ minWidth: 300 }}
            fullWidth
        >
            <DialogTitle>{`Incoming Call `}</DialogTitle>
            <Divider />
            <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                    {caller && caller.name
                        ? `${caller.name} is Calling`
                        : `Some One is Calling`}
                </DialogContentText>
            </DialogContent>
            <Divider />
            <DialogActions>
                <Fab sx={{bgcolor: 'green', ':hover': {bgcolor: 'green', opacity: .7}}} aria-label="add" onClick={onAccept}>
                    <PhoneIcon sx={{color: '#fff'}} />
                </Fab>
                <Fab sx={{bgcolor: 'red', ':hover': {bgcolor: 'red', opacity: .7}}}  aria-label="add" onClick={onReject}>
                    <PhoneDisabledIcon sx={{color: '#fff'}}/>
                </Fab>     
            </DialogActions>
        </Dialog>
    );
};

export default AcceptCallDialog;
