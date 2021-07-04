import React, { MutableRefObject, useState } from "react";

import { Box, Divider, TextField, Typography } from "@material-ui/core";
import DragHandleIcon from "@material-ui/icons/DragHandle";
import SendIcon from "@material-ui/icons/Send";

import { Resizable } from "re-resizable";
import Draggable from "react-draggable";
import Message from "./Message";

interface ChatMessagesProps {
    messages: any[];
    sendMessage(message: string): void;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
    messages,
    sendMessage,
}) => {
    const [message, setMessage] = useState("");
    return (
        <Draggable handle="strong" bounds="parent">
            <Resizable
                defaultSize={{ width: 240, height: "100vh" }}
                style={{
                    position: "absolute",
                    right: 20,
                    top: 0,
                    backgroundColor: "#fff",
                    borderRadius: 20,
                }}
                minWidth={240}
                minHeight={400}
                maxHeight={"80vh"}
                maxWidth={500}
            >
                <Box
                    sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            p: 1,
                        }}
                    >
                        <Typography>Send Message</Typography>
                        <strong>
                            <DragHandleIcon sx={{ cursor: "move" }} />
                        </strong>
                    </Box>
                    <Divider />
                    <Box sx={{ flexGrow: 1, overflowY: "scroll" }}>
                        {messages.map((m,i) => (
                            <Message  key={i} message={m} />
                        ))}
                    </Box>
                    <Divider />
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <Box sx={{ flexGrow: 1 }}>
                            <TextField
                                fullWidth
                                value={message}
                                onKeyUp={(e) => {
                                    if(e.keyCode === 13 && message !== '') {
                                        sendMessage(message);
                                        setMessage('')
                                    }
                                }}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                        </Box>
                        <div
                            onClick={() => {
                                sendMessage(message);
                                setMessage("");
                            }}
                        >
                            <Box sx={{ cursor: "pointer", py: 1, px: 2 }}>
                                <SendIcon sx={{ color: "primary.main" }} />
                            </Box>
                        </div>
                    </Box>
                </Box>
            </Resizable>
        </Draggable>
    );
};

export default ChatMessages;
