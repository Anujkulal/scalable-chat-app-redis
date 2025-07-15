import Valkey from "iovalkey";
import { Server } from "socket.io";

const pub = new Valkey({
    host: "valkey-21ecaae2-anujkulal-3df3.f.aivencloud.com",
    port: 24493,
    username: "default",
    password: "AVNS_Hf2sArXUKhCwsXjrYCc",
})
const sub = new Valkey({
    host: "valkey-21ecaae2-anujkulal-3df3.f.aivencloud.com",
    port: 24493,
    username: "default",
    password: "AVNS_Hf2sArXUKhCwsXjrYCc",
})

class SocketService {
    private _io:Server; // Instance of Socket.IO server
    constructor(){
        console.log("SocketService initialized");
        this._io = new Server({
            cors: {
                allowedHeaders: ["*"],
                origin: "*",
            }
        });

        // ****** using pub/sub ******
        sub.subscribe("MESSAGES")
    }

    public initListeners() {
        const io = this._io;
        console.log("Initializing Socket.IO listeners...");
        
        io.on("connection", (socket) => {
            console.log("New Socket connected:", socket.id);
            
            socket.on("event:message", async ({message}: {message: string}) => {
                // socket.broadcast.emit("message", JSON.stringify({message})); // Broadcast to all clients except the sender
                // io.emit("message", JSON.stringify({message}));
                // console.log("New message received:", message);

                // ****** using pub/sub to broadcast message ******
                await pub.publish("MESSAGES", JSON.stringify({message}));
                console.log("Message broadcasted to all clients:", message);
            });
            
        })

        // ****** using pub/sub to listen for messages ******
        sub.on("message", (channel, message) => {
            if(channel === "MESSAGES"){
                io.emit("message", message);
                console.log("Message broadcasted to all clients from valkey-redis:", message);
            }
        })

        // ****** using normal socket.io message event ******
        // io.on("message", (msg) => {
        //     io.emit("message", msg);
        //     console.log("Message sent to all client:", msg);
        // })
        
    }

    get io() {
        return this._io;
    }

}

export default SocketService;