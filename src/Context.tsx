import React, { createContext, useState, useRef, useEffect } from "react";
import io from "socket.io-client";
import Peer, { SignalData } from "simple-peer";

const SocketContext = createContext(null);

// const socket = io('http://localhost:5000');
const socket = io("http://localhost:3000");

const ContextProvider = ({ children }) => {
    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);
    const [stream, setStream] = useState<MediaStream>();
    const [name, setName] = useState("");
    const [call, setCall] =
        useState<{
            isReceivingCall: boolean;
            from: { name: string; socket_id: string };
            signal: any;
        }>();
    const [me, setMe] = useState("");

    console.log(me)

    const myVideo = useRef<HTMLVideoElement>();
    const userVideo = useRef<HTMLVideoElement>();
    const connectionRef = useRef<Peer.Instance>();

    useEffect(() => {
        navigator.mediaDevices
            .getUserMedia({ video: true, audio: true })
            .then((currentStream) => {
                setStream(currentStream);

                if(myVideo.current) {

                  myVideo.current.srcObject = currentStream;
                }
            });

        socket.on("me", (id: string) => setMe(id));

        socket.on("user.calling", ({ from, signal }) => {
            setCall({ isReceivingCall: true, from, signal });
        });
    }, [myVideo]);

    const answerCall = () => {
        setCallAccepted(true);

        const peer = new Peer({ initiator: false, trickle: false, stream });

        peer.on("signal", (data: SignalData) => {
            socket.emit("answer.call", { signal: data, to: call.from });
        });

        peer.on("stream", (currentStream) => {
            userVideo.current.srcObject = currentStream;
        });

        peer.signal(call.signal);

        connectionRef.current = peer;
    };

    const callUser = (id: string) => {
        const peer = new Peer({ initiator: true, trickle: false, stream });

        peer.on("signal", (data) => {
            socket.emit("call.user", {
                userToCall: id,
                signalData: data,
                from: { socket_id: me, name },
            });
        });

        peer.on("stream", (currentStream) => {
            userVideo.current.srcObject = currentStream;
        });

        socket.on("call.accepted", (signal: SignalData) => {
            setCallAccepted(true);

            peer.signal(signal);
        });

        connectionRef.current = peer;
    };

    const leaveCall = () => {
        setCallEnded(true);

        connectionRef.current.destroy();

        window.location.reload();
    };

    const values = {
        call,
        callAccepted,
        myVideo,
        userVideo,
        stream,
        name,
        setName,
        callEnded,
        me,
        callUser,
        leaveCall,
        answerCall,
    };

    return (
        <SocketContext.Provider value={values}>
            {children}
        </SocketContext.Provider>
    );
};

export { ContextProvider, SocketContext };
