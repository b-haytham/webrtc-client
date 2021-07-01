import React, { useEffect, useRef, useState } from "react";

import { makeStyles } from "@material-ui/styles";
import { Paper, TextField, Typography, Grid, Box } from "@material-ui/core";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Button from "../src/components/Button";

import io from "socket.io-client";
import Peer, { SignalData } from "simple-peer";

import AssignmentIcon from "@material-ui/icons/Assignment";
import CallIcon from "@material-ui/icons/Call";

const useStyles = makeStyles((theme) => ({
    bg: {
        minHeight: "100vh",
        backgroundColor: "#ffffff",
        opacity: 0.8,
        backgroundImage:
            "repeating-radial-gradient( circle at 0 0, transparent 0, #ffffff 7px ), repeating-linear-gradient( #00b8fa55, #00b8fa )",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
}));

export default function Home() {
    const classes = useStyles();
    // const { name, setName, me, call, callUser, myVideo, userVideo, answerCall, callAccepted } =
    //     useContext(SocketContext);
    const [name, setName] = useState("");
    const [idToCall, setIdToCall] = useState("");
    const [me, setMe] = useState("");
    const [stream, setStream] = useState<MediaStream>();
    const [receivingCall, setReceivingCall] = useState(false);
    const [caller, setCaller] = useState(null);
    const [callerSignal, setCallerSignal] = useState();
    const [callAccepted, setCallAccepted] = useState(false);

    const socket = useRef<any>();
    const myVideo = useRef<HTMLVideoElement>();
    const userVideo = useRef<HTMLVideoElement>();

    useEffect(() => {
        socket.current = io("http://localhost:3000");
        navigator.mediaDevices
            .getUserMedia({ video: true, audio: true })
            .then((stream) => {
                setStream(stream);
                if(myVideo.current){
                    myVideo.current.srcObject = stream;
                }
            });

        socket.current.on("me", (id: string) => {
            setMe(id);
        });

        socket.current.on("user.calling", (data) => {
            console.log(data)
            setReceivingCall(true);
            setCaller(data.from);
            setCallerSignal(data.signal);
        });
    }, []);

    function callPeer(id: string) {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            config: {
                iceServers: [
                    {
                        urls: "stun:numb.viagenie.ca",
                        username: "sultan1640@gmail.com",
                        credential: "98376683",
                    },
                    {
                        urls: "turn:numb.viagenie.ca",
                        username: "sultan1640@gmail.com",
                        credential: "98376683",
                    },
                ],
            },
            stream: stream,
        });

        peer.on("signal", (data) => {
            socket.current.emit("call.user", {
                user_to_call: id,
                signal: data,
                from: { socket_id: me, name },
            });
        });

        peer.on("stream", (stream) => {
            userVideo.current.srcObject = stream;
        });

        socket.current.on("call.accepted", ({signal}) => {
            setCallAccepted(true);
            peer.signal(signal);
        });
    }

    function acceptCall() {
        setCallAccepted(true);
        const peer = new Peer({
          initiator: false,
          trickle: false,
          stream: stream,
        });
        peer.on("signal", data => {
          socket.current.emit("answer.call", { signal: data, to: caller.socket_id })
        })
    
        peer.on("stream", stream => {
          userVideo.current.srcObject = stream;
        });
    
        peer.signal(callerSignal);
      }
    

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "#ffffff",
                opacity: 0.8,
                backgroundImage:
                    "repeating-radial-gradient( circle at 0 0, transparent 0, #ffffff 7px ), repeating-linear-gradient( #00b8fa55, #00b8fa )",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Box>
                <video ref={myVideo} playsInline autoPlay muted />
            </Box>
            {callAccepted && <Box>
                <video ref={userVideo} playsInline autoPlay />
            </Box>}
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
                                title="Copy Your ID"
                                right_icon={<AssignmentIcon sx={{ ml: 2 }} />}
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
                {receivingCall && caller && (
                    <>
                        <Typography>
                            {caller.name} is Calling .....
                        </Typography>{" "}
                        <Button
                            title="Accept"
                            right_icon={<CallIcon sx={{ ml: 2 }} />}
                            onClick={() => {
                                acceptCall()
                            }}
                        />
                    </>
                )}
            </Paper>
        </Box>
    );
}
