import React, { createContext, useState, useRef, useEffect } from "react";
import io from "socket.io-client";
import Peer, { SignalData } from "simple-peer";

const SocketContext = createContext(null);

// const socket = io('http://localhost:5000');
//const socket = io("http://localhost:3000");

const ContextProvider = ({ children }) => {
    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);
    const [stream, setStream] = useState<MediaStream>();
    const [name, setName] = useState("");
    const [call, setCall] = useState<{
        isReceivingCall: boolean;
        from: { name: string; socket_id: string };
        signal: SignalData;
    }>();
    const [me, setMe] = useState("");

    const socket = useRef();
    const myVideo = useRef<HTMLVideoElement>();
    const userVideo = useRef<HTMLVideoElement>();
    const connectionRef = useRef<Peer.Instance>();

    useEffect(() => {
        socket.current = io("http://localhost:3000");
        navigator.mediaDevices
            .getUserMedia({ video: true, audio: true })
            .then((currentStream) => {
                setStream(currentStream);
                myVideo.current.srcObject = currentStream;
            });

        socket.current.on("me", (id: string) => setMe(id));

        socket.current.on("user.calling", ({ from, signal }) => {
            setCall({ isReceivingCall: true, from, signal });
        });
    }, []);

    const answerCall = () => {
        setCallAccepted(true);

        const peer = new Peer({ initiator: false, trickle: false, stream });

        peer.on("signal", (data: SignalData) => {
            socket.current.emit("answer.call", {
                signal: data,
                to: call.from.socket_id,
            });
        });

        peer.on("stream", (currentStream) => {
            userVideo.current.srcObject = currentStream;
        });

        peer.signal(call.signal);

    };

    const callUser = (id: string) => {
        const peer = new Peer({ initiator: true, trickle: false, stream });

        peer.on("signal", (data) => {
            // console.log({
            //     user_to_call: id,
            //     signal: data,
            //     from: { socket_id: me, name },
            // })
            socket.current.emit("call.user", {
                user_to_call: id,
                signal: data,
                from: { socket_id: me, name },
            });
        });

        peer.on("stream", (currentStream) => {
            if (userVideo.current) {
                userVideo.current.srcObject = currentStream;
            }
        });

        socket.current.on("call.accepted", (signal: SignalData) => {
            setCallAccepted(true);

            peer.signal(signal);
        });

       
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
