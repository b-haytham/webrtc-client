import { useEffect, useRef, useState } from "react";

import io from 'socket.io-client'

import Peer from 'simple-peer'

function ab2str(buf) {
   // return String.fromCharCode.apply(null, new Uint8Array(buf));
    return new TextDecoder().decode(buf)
}
  

export const useWebRTC = () => {
    const [name, setName] = useState("");
    const [me, setMe] = useState("");
    const [stream, setStream] = useState<MediaStream>();
    const [receivingCall, setReceivingCall] = useState(false);
    const [caller, setCaller] = useState(null);
    const [callerSignal, setCallerSignal] = useState();
    const [callAccepted, setCallAccepted] = useState(false);

    const socket = useRef<any>();
    const myVideo = useRef<HTMLVideoElement>();
    const userVideo = useRef<HTMLVideoElement>();

    const callerPeer  = useRef<Peer.Instance>()
    const answerPeer  = useRef<Peer.Instance>()

    useEffect(() => {
        socket.current = io("http://localhost:3000");
        window.navigator.mediaDevices
            .getUserMedia({ video: true, audio: true })
            .then((stream) => {
                setStream(stream);
                if (myVideo.current) {
                    myVideo.current.srcObject = stream;
                }
            });

        socket.current.on("me", (id: string) => {
            setMe(id);
        });

        socket.current.on("user.calling", (data) => {
            console.log(data);
            setReceivingCall(true);
            setCaller(data.from);
            setCallerSignal(data.signal);
        });
    }, []);

    function callPeer(id: string) {
        callerPeer.current = new Peer({
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

        callerPeer.current.on("signal", (data) => {
            socket.current.emit("call.user", {
                user_to_call: id,
                signal: data,
                from: { socket_id: me, name },
            });
        });

        callerPeer.current.on("stream", (stream) => {
            userVideo.current.srcObject = stream;
        });

        callerPeer.current.on('data', m => console.log('caller get message >>', ab2str(m)))

        socket.current.on("call.accepted", ({ signal }) => {
            setCallAccepted(true);
            callerPeer.current.signal(signal);
        });
    }

    function acceptCall() {
        setCallAccepted(true);
        answerPeer.current = new Peer({
            initiator: false,
            trickle: false,
            stream: stream,
        });
        answerPeer.current.on("signal", (data) => {
            socket.current.emit("answer.call", {
                signal: data,
                to: caller.socket_id,
            });
        });

        answerPeer.current.on("stream", (stream) => {
            userVideo.current.srcObject = stream;
        });

        answerPeer.current.on('data', m => console.log('answer got message >> ', ab2str(m)))

        answerPeer.current.signal(callerSignal);
    }

    function sendMessage(message: string) {
        if(receivingCall) {
            answerPeer.current.send(message)
        }else {
            callerPeer.current.send(message)
        }
    }

    return { me, stream, callPeer, acceptCall, receivingCall, callAccepted, myVideo, userVideo, name, setName, caller, callerSignal, sendMessage }

}