import React from "react";

import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    Fab,
} from "@material-ui/core";
import PhoneDisabledIcon from "@material-ui/icons/PhoneDisabled";

import SlideTransition from "./SlideTransitionComp";

interface CallingDialogProps {
    open: boolean;
    handleClose(): void;
    onCancel(): void;
}

const CallingDialog: React.FC<CallingDialogProps> = ({
    open,
    handleClose,
    onCancel,
}) => {
    return (
        <Dialog
            open={open}
            TransitionComponent={SlideTransition}
            keepMounted
            onClose={handleClose}
            aria-describedby="alert-dialog-slide-description"
            sx={{ minWidth: 300 }}
            fullWidth
        >
            <DialogTitle>{`Making A Call `}</DialogTitle>
            <Divider />
            <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                    Wait for response ...
                </DialogContentText>
            </DialogContent>
            <Divider />
            <DialogActions>
                <Fab
                    sx={{
                        bgcolor: "red",
                        ":hover": { bgcolor: "red", opacity: 0.7 },
                    }}
                    aria-label="add"
                    onClick={onCancel}
                >
                    <PhoneDisabledIcon sx={{ color: "#fff" }} />
                </Fab>
            </DialogActions>
        </Dialog>
    );
};

export default CallingDialog;
