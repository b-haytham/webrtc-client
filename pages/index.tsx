import React, { useEffect, useRef, useState } from "react";

import { makeStyles } from "@material-ui/styles";
import { Paper, TextField, Typography, Grid, Box } from "@material-ui/core";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Button from "../src/components/Button";

import io from "socket.io-client";
import Peer from "simple-peer";

import AssignmentIcon from "@material-ui/icons/Assignment";
import CallIcon from "@material-ui/icons/Call";
import VideoChat from "../src/components/VideoChat";
import { useWebRTC } from "../src/useWebRTC";

export default function Home() {
    const [showVideos, setShowVideos] = useState(false);
    const [idToCall, setIdToCall] = useState("");
    const [message, setMessage] = useState('')
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
        callerSignal,
        sendMessage,
    } = useWebRTC();
    // const [name, setName] = useState("");
    // const [me, setMe] = useState("");
    // const [stream, setStream] = useState<MediaStream>();
    // const [receivingCall, setReceivingCall] = useState(false);
    // const [caller, setCaller] = useState(null);
    // const [callerSignal, setCallerSignal] = useState();
    // const [callAccepted, setCallAccepted] = useState(false);

    // const socket = useRef<any>();
    // const myVideo = useRef<HTMLVideoElement>();
    // const userVideo = useRef<HTMLVideoElement>();

    // useEffect(() => {
    //     socket.current = io("http://localhost:3000");
    //     window.navigator.mediaDevices
    //         .getUserMedia({ video: true, audio: true })
    //         .then((stream) => {
    //             setStream(stream);
    //             if (myVideo.current) {
    //                 myVideo.current.srcObject = stream;
    //             }
    //         });

    //     socket.current.on("me", (id: string) => {
    //         setMe(id);
    //     });

    //     socket.current.on("user.calling", (data) => {
    //         console.log(data);
    //         setReceivingCall(true);
    //         setCaller(data.from);
    //         setCallerSignal(data.signal);
    //     });
    // }, []);

    // function callPeer(id: string) {
    //     const peer = new Peer({
    //         initiator: true,
    //         trickle: false,
    //         config: {
    //             iceServers: [
    //                 {
    //                     urls: "stun:numb.viagenie.ca",
    //                     username: "sultan1640@gmail.com",
    //                     credential: "98376683",
    //                 },
    //                 {
    //                     urls: "turn:numb.viagenie.ca",
    //                     username: "sultan1640@gmail.com",
    //                     credential: "98376683",
    //                 },
    //             ],
    //         },
    //         stream: stream,
    //     });

    //     peer.on("signal", (data) => {
    //         socket.current.emit("call.user", {
    //             user_to_call: id,
    //             signal: data,
    //             from: { socket_id: me, name },
    //         });
    //     });

    //     peer.on("stream", (stream) => {
    //         userVideo.current.srcObject = stream;
    //     });

    //     socket.current.on("call.accepted", ({ signal }) => {
    //         setCallAccepted(true);
    //         peer.signal(signal);
    //     });
    // }

    // function acceptCall() {
    //     setCallAccepted(true);
    //     const peer = new Peer({
    //         initiator: false,
    //         trickle: false,
    //         stream: stream,
    //     });
    //     peer.on("signal", (data) => {
    //         socket.current.emit("answer.call", {
    //             signal: data,
    //             to: caller.socket_id,
    //         });
    //     });

    //     peer.on("stream", (stream) => {
    //         userVideo.current.srcObject = stream;
    //     });

    //     peer.signal(callerSignal);
    // }

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
                sx={{ display: "flex", justifyContent: "space-evenly", py: 3 }}
            >
                <Box sx={{ borderRadius: 5, overflow: "hidden" }}>
                    <video ref={myVideo} playsInline autoPlay muted />
                </Box>
                {callAccepted && stream && (
                    <Box sx={{ borderRadius: 5, overflow: "hidden" }}>
                        <video ref={userVideo} playsInline autoPlay />
                    </Box>
                )}
            </Box>

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Paper
                    sx={{ p: 2, borderRadius: 3, minWidth: "70%" }}
                    elevation={5}
                >
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
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
                                    title="Copy Your ID"
                                    right_icon={
                                        <AssignmentIcon sx={{ ml: 2 }} />
                                    }
                                />
                            </CopyToClipboard>
                        </Grid>
                        <Grid item xs={12} md={4}>
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
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                label="Message"
                                variant="outlined"
                                helperText="send message"
                            />

                            <Button
                                title="Send"
                                right_icon={<CallIcon sx={{ ml: 2 }} />}
                                onClick={() => {
                                    sendMessage(message);
                                }}
                            />
                        </Grid>
                    </Grid>
                    {receivingCall && caller && !callAccepted && (
                        <>
                            <Typography>
                                {caller.name} is Calling .....
                            </Typography>
                            <Button
                                title="Accept"
                                right_icon={<CallIcon sx={{ ml: 2 }} />}
                                onClick={() => {
                                    acceptCall();
                                }}
                            />
                        </>
                    )}
                    {callAccepted && stream && (
                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                            <Button
                                title="Accept"
                                right_icon={<CallIcon sx={{ ml: 2 }} />}
                                onClick={() => {
                                    acceptCall();
                                }}
                            />
                        </Box>
                    )}
                </Paper>
            </Box>
            {showVideos && <VideoChat />}
        </Box>
    );
}
