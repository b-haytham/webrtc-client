import { Box } from "@material-ui/core"
import React from "react"

interface VideoChatProps {
    
}

const VideoChat: React.FC<VideoChatProps> = () => {
    return (
        <Box sx={{position: 'absolute', width: '100vw', height: '100vh', top: 0, left: 0, backgroundColor: '#fff', zIndex: 5555}}>
          
        </Box>
    )
}

export default VideoChat