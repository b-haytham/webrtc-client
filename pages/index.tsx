import { useContext, useEffect } from "react"
import io from 'socket.io-client'
import { SocketContext } from "../src/Context"

export default function Home() {

  const context = useContext(SocketContext)

  return (
    <div>
      
    </div>
  )
}
