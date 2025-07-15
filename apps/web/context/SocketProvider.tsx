"use client"

import React, { createContext, useCallback, useContext, useEffect, useState } from "react"
import { io, Socket } from "socket.io-client";

interface SocketContextType {
    children?: React.ReactNode;
}

interface ISocketCoontext{
    sendMessage: (message: string) => any;
    messages: string[];
}

const SocketContext = createContext<ISocketCoontext | null>(null);

export const useSocket = () => {
    const state = useContext(SocketContext);
    if (!state) {
        throw new Error("state in undefined");
    }
    return state;
}

export const SocketProvider: React.FC<SocketContextType> = ({children}) => {
    const [socket, setSocket] = useState<Socket>();
    const [messages, setMessages] = useState<string[]>([]);

    const sendMessage: ISocketCoontext["sendMessage"] = useCallback((msg) => {
        console.log("Socket message sent", msg);
        if(socket){
            socket.emit("event:message", {message: msg})
        }
    }, [socket]);

    const onMessageReceived = useCallback((msg: string) => {
        console.log("Message received from socket:", msg);
        const {message} = JSON.parse(msg) as {message: string};
        setMessages(prev => [...prev, message]);
    }, [])

    useEffect(() => {
        const _socket = io("http://localhost:8000");
        _socket.on("message", onMessageReceived);

        setSocket(_socket);

        return () => {
            _socket.disconnect();
            _socket.off("message", onMessageReceived); // Clean up the event listener
            setSocket(undefined); // Clear the socket state
            console.log("Socket disconnected");
        }
    }, [])
    return (
        <SocketContext.Provider value={{sendMessage, messages}}>
            {children}
        </SocketContext.Provider>
    )
}