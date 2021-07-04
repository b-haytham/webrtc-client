import React, { useState, StyleHTMLAttributes, Ref } from "react";

import { Box } from "@material-ui/core";

import Draggable from "react-draggable";
import { Resizable } from "re-resizable";
import { MutableRefObject } from "react";
import { useMediaQuery } from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import { MyTheme } from "../../theme";

interface MyVideoProps {
    myVideoRef: MutableRefObject<HTMLVideoElement>;
    stream: MediaStream;
}

const MyVideo: React.FC<MyVideoProps> = ({ myVideoRef, stream }) => {
    const [cursor, setCursor] = useState<"grab" | "grabbing">("grab");
    const mobile = useMediaQuery((theme: MyTheme) => theme.breakpoints.down('sm'))
    
    const leftPosition = () => {
        if(!mobile) return 50
        
        if(typeof window === 'undefined') {
            return 50 
        }else {
            return window.innerWidth / 2 - 50
        }
    }
 
    const bottomPosition = () => {
        if(!mobile) return 50
        
        if(typeof window === 'undefined') {
            return 50 
        }else {
            return window.innerHeight / 2 - 50
        }
    }

    return (
        <Draggable
            bounds="parent"
            onStart={() => setCursor("grabbing")}
            onStop={() => setCursor("grab")}
        >
            <Box
                sx={{
                    width:  mobile ? 100 : 200,
                    height: mobile ? 100 : 200,
                    position: "absolute",
                    left: leftPosition(),
                    bottom: bottomPosition(),
                    backgroundColor: "gray",
                    borderRadius: mobile ? 50 : 100,
                    overflow: "hidden",
                    cursor,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                {stream && (
                    <video
                        ref={myVideoRef}
                        playsInline
                        autoPlay
                        muted
                        height={mobile ? 100 :  200}
                    />
                )}
            </Box>
        </Draggable>
    );
};

export default MyVideo;
