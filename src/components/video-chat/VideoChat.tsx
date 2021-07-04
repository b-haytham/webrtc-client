import React, { MutableRefObject } from "react";

import { Box, Fab, useMediaQuery } from "@material-ui/core";

import ChatMessages from "./ChatMessages";
import MyVideo from "./MyVideo";
import PhoneDisabledIcon from "@material-ui/icons/PhoneDisabled";
import { MyTheme } from "../../theme";

interface VideoChatProps {
    stream: MediaStream;
    callAccepted: boolean;
    myVideoRef: MutableRefObject<HTMLVideoElement>;
    userVideoRef: MutableRefObject<HTMLVideoElement>;
    messages: object[];
    sendMessage(message: string): void;
    onEndCall(): void;
}

const VideoChat: React.FC<VideoChatProps> = ({
    stream,
    callAccepted,
    myVideoRef,
    userVideoRef,
    messages,
    sendMessage,
    onEndCall,
}) => {
    const mobile = useMediaQuery((theme: MyTheme) => theme.breakpoints.down('sm'))
    
    const endButtonRightPosition = () => {
        if(!mobile) return 50
        
        if(typeof window === 'undefined') {
            return 50 
        }else {
            return window.innerWidth / 2 - 30
        }
    }
 
   
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
                // backgroundImage:
                //     "repeating-radial-gradient( circle at 0 0, transparent 0, #ffffff 7px ), repeating-linear-gradient( #00b8fa55, #00b8fa )",
            }}
        >
            <Box sx={{ width: "100%", height: "100%", overflow: "hidden" }}>
                {callAccepted && stream && (
                    <video
                        ref={userVideoRef}
                        playsInline
                        autoPlay
                        
                        //style={{ width: "100%", height: "100%" }}
                        width={window.innerWidth}
                         //height={window.innerHeight}
                    />
                )}
            </Box>
            <Box sx={{ position: "absolute", bottom: 60, right: endButtonRightPosition() }}>
                <Fab
                    sx={{
                        bgcolor: "red",
                        ":hover": { bgcolor: "red", opacity: 0.7 },
                    }}
                    aria-label="add"
                    onClick={onEndCall}
                >
                    <PhoneDisabledIcon sx={{ color: "#fff" }} />
                </Fab>
            </Box>
            
            {!mobile && <ChatMessages messages={messages} sendMessage={sendMessage} />}
                       
            <MyVideo stream={stream} myVideoRef={myVideoRef} />
        </Box>
    );
};

export default VideoChat;
