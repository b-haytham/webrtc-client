import React, { useState, StyleHTMLAttributes, Ref } from "react";

import { Box } from "@material-ui/core";

import Draggable from "react-draggable";
import { Resizable } from "re-resizable";
import { MutableRefObject } from "react";

interface MyVideoProps {
    myVideoRef: MutableRefObject<HTMLVideoElement>;
    stream: MediaStream;
}

const MyVideo: React.FC<MyVideoProps> = ({ myVideoRef, stream }) => {
    const [cursor, setCursor] = useState<"grab" | "grabbing">("grab");

    const [dimensions, setDimensions] = useState({
        width: 200,
        height: 200,
        borderRadius: 100,
    });

    return (
        <Draggable
            bounds="parent"
            onStart={() => setCursor("grabbing")}
            onStop={() => setCursor("grab")}
        >
            <Box
                sx={{
                    width: dimensions.width,
                    height: dimensions.height,
                    position: "absolute",
                    left: 50,
                    bottom: 50,
                    backgroundColor: "gray",
                    borderRadius: dimensions.borderRadius,
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
                        height={200}
                    />
                )}
            </Box>
        </Draggable>
    );
};

export default MyVideo;
