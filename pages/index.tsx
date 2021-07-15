import React, { useEffect, useState } from "react";
import Image from 'next/image'

import {
    Paper,
    TextField,
    Grid,
    Box,
    Fab,
    CircularProgress,
} from "@material-ui/core";
import { CopyToClipboard } from "react-copy-to-clipboard";

import AssignmentIcon from "@material-ui/icons/Assignment";
import CallIcon from "@material-ui/icons/Call";
import VideoChat from "../src/components/video-chat/VideoChat";
import { useWebRTC } from "../src/useWebRTC";
import AcceptCallDialog from "../src/components/AcceptCallDialog";
import CallingDialog from "../src/components/CallingDialog";

export default function Home() {
    const [idToCall, setIdToCall] = useState("");

    const [openAcceptDialog, setOpenAccepDialog] = useState(false);
    const [openCallingDialog, setOpenCallingDialog] = useState(false);
    const {
        name,
        setName,
        userVideo,
        myVideo,
        callAccepted,
        callPeer,
        stream,
        acceptCall,
        me,
        receivingCall,
        caller,
        sendMessage,
        messages,
        rejectCall,
        calling,
        cancelCall,
        endCall,
    } = useWebRTC();

    useEffect(() => {
        if (receivingCall) {
            setOpenAccepDialog(true);
        } else {
            setOpenAccepDialog(false);
        }
    }, [receivingCall]);

    useEffect(() => {
        if (calling) {
            setOpenCallingDialog(true);
        } else {
            setOpenCallingDialog(false);
        }
    }, [calling]);

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "#ffffff",
                opacity: 0.8,
                backgroundImage:
                    "repeating-radial-gradient( circle at 0 0, transparent 0, #ffffff 7px ), repeating-linear-gradient( #00b8fa55, #00b8fa )",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "100vh",
                }}
            >
                <Paper
                    sx={{ position: 'relative' ,p: 2, borderRadius: 3, minWidth: "70%", mx: 2 }}
                    elevation={5}
                >
                    {!me && <Box
                        sx={{position: "absolute", top: 20, right: 20}}
                    >
                        <CircularProgress size={30} />
                    </Box>}
                    <Box sx={{display: 'flex', pb: 3, justifyContent: 'center'}}>
                        <Image 
                            src={'/chat-icon.svg'}
                            width={100}
                            height={100}
                        />
                    </Box>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                label="Name"
                                variant="outlined"
                                helperText="Set your name"
                            />
                            <CopyToClipboard text={me || " "}>
                                <Fab
                                    disabled={me === ""}
                                    variant="extended"
                                    size="medium"
                                    color="primary"
                                    aria-label="add"
                                    sx={{ color: "#fff", mt: 2 }}
                                >
                                    {me !== ""
                                        ? `Your ID is ${me}`
                                        : "Copy Your ID"}
                                    <AssignmentIcon sx={{ ml: 2 }} />
                                </Fab>                                
                            </CopyToClipboard>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                required
                                fullWidth
                                value={idToCall}
                                onChange={(e) => setIdToCall(e.target.value)}
                                label="ID to call"
                                variant="outlined"
                                helperText="Enter user ID To call"
                            />

                            <Fab
                                disabled={idToCall.trim() === ''}
                                variant="extended"
                                size="medium"
                                color="primary"
                                aria-label="add"
                                sx={{ color: "#fff", mt: 2 }}
                                onClick={() => {
                                    callPeer(idToCall);
                                }}
                            >
                                Call
                                <CallIcon sx={{ ml: 2 }} />
                            </Fab>
                        </Grid>
                    </Grid>
                    
                </Paper>
                <AcceptCallDialog
                        open={openAcceptDialog}
                        caller={caller}
                        handleClose={() => setOpenAccepDialog(false)}
                        onAccept={() => {
                            setOpenAccepDialog(false);
                            acceptCall();
                        }}
                        onReject={async () => {
                            setOpenAccepDialog(false);
                            await rejectCall();
                        }}
                    />
                    <CallingDialog
                        open={openCallingDialog}
                        handleClose={() => setOpenCallingDialog(false)}
                        onCancel={() => cancelCall(idToCall)}
                    />
            </Box>

            <VideoChat
                myVideoRef={myVideo}
                userVideoRef={userVideo}
                stream={stream}
                callAccepted={callAccepted}
                messages={messages}
                sendMessage={sendMessage}
                onEndCall={() => endCall(idToCall)}
            />
        </Box>
    );
}
