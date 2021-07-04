import React, { useEffect, useState } from "react";

import { makeStyles } from "@material-ui/styles";
import { Paper, TextField, Typography, Grid, Box } from "@material-ui/core";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Button from "../src/components/Button";

import AssignmentIcon from "@material-ui/icons/Assignment";
import CallIcon from "@material-ui/icons/Call";
import VideoChat from "../src/components/video-chat/VideoChat";
import { useWebRTC } from "../src/useWebRTC";
import AcceptCallDialog from "../src/components/AcceptCallDialog";

export default function Home() {
    const [idToCall, setIdToCall] = useState("");
    const [message, setMessage] = useState("");
    const [open, setOpen] = useState(false)
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
        rejectCall
    } = useWebRTC();


    useEffect(() => {
        if(receivingCall) {
            setOpen(true)
        }
    }, [receivingCall])

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
                    minHeight: '100vh'
                }}
            >
                <Paper
                    sx={{ p: 2, borderRadius: 3, minWidth: "70%" }}
                    elevation={5}
                >
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
                                <Button
                                    title={me !== '' ? `Your ID is ${me}` : "Copy Your ID"}
                                    right_icon={
                                        <AssignmentIcon sx={{ ml: 2 }} />
                                    }
                                />
                            </CopyToClipboard>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                value={idToCall}
                                onChange={(e) => setIdToCall(e.target.value)}
                                label="ID to call"
                                variant="outlined"
                                helperText="Enter user ID To call"
                            />

                            <Button
                                title="Call"
                                right_icon={<CallIcon sx={{ ml: 2 }} />}
                                onClick={() => {
                                    callPeer(idToCall);
                                }}
                            />
                        </Grid>
                        
                    </Grid>
                    <AcceptCallDialog
                        open={open}
                        handleClose={() => setOpen(false)}
                        onAccept={() =>{ 
                            acceptCall()
                            setOpen(false)
                        }}
                        onReject={() => {
                            rejectCall()
                            setOpen(false)
                        }}
                    />
                </Paper>
            </Box>

            <VideoChat
                myVideoRef={myVideo}
                userVideoRef={userVideo}
                stream={stream}
                callAccepted={callAccepted}
                messages={messages}
                sendMessage={sendMessage}
            />
        </Box>
    );
}
