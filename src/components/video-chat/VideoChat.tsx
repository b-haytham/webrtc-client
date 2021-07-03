import { Box } from "@material-ui/core";
import React, { MutableRefObject } from "react";
import { Ref } from "react";
import ChatMessages from "./ChatMessages";
import MyVideo from "./MyVideo";

import { Resizable } from "re-resizable";

interface VideoChatProps {
    stream: MediaStream;
    callAccepted: boolean;
    myVideoRef: MutableRefObject<HTMLVideoElement>;
    userVideoRef: MutableRefObject<HTMLVideoElement>;
    messages: object[];
    sendMessage(message: string): void;
}

const VideoChat: React.FC<VideoChatProps> = ({
    stream,
    callAccepted,
    myVideoRef,
    userVideoRef,
    messages,
    sendMessage,
}) => {
    return (
        <Box
            sx={{
                position: "absolute",
                width: "100vw",
                height: "100vh",
                top: 0,
                left: 0,
                opacity: callAccepted ? 1 : 0,
                backgroundColor: "#fff",
                zIndex: callAccepted ? 1 : -1,
                backgroundImage:
                    "repeating-radial-gradient( circle at 0 0, transparent 0, #ffffff 7px ), repeating-linear-gradient( #00b8fa55, #00b8fa )",
            }}
        >
            <Box sx={{width: '100%', height: '100%', overflow:'hidden'}}>
                {callAccepted && stream && (
                    <video
                        ref={userVideoRef}
                        playsInline
                        autoPlay
                        style={{width :'100%', height: '100%'}}
                        width={window.innerWidth}
                        height={window.innerHeight}
                    />
                )}
            </Box>

            <ChatMessages messages={messages} sendMessage={sendMessage} />
            <MyVideo stream={stream} myVideoRef={myVideoRef} />
        </Box>
    );
};

export default VideoChat;
