import { Box, Typography } from "@material-ui/core";
import React from "react";

interface MessageProps {
    message: any;
}

const Message: React.FC<MessageProps> = ({ message }) => {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: message.position === "right"
                ? "right"
                : "left", 
            }}
        >
            <Box
                sx={{
                    maxWidth: "50%",
                    bgcolor: "primary.main",
                    m: 1,
                    px: 2,
                    py:1,
                    borderRadius: 20,
                }}
            >
                <Typography sx={{width: '100%'}} color='#fff'>{message.text}</Typography>
            </Box>
        </Box>
    );
};

export default Message;
