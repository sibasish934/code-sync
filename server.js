// npm install codemirror codemirror/mode/javascript dockerfile-parser

import express from "express";
import {Server} from "socket.io";
import http from "http"
import ACTIONS from "./Actions.js";
import path, {dirname} from "path";
import { fileURLToPath } from 'url';


const app = express();
const server = http.createServer(app);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const io = new Server(server);

const port = process.env.PORT || 5000;
const host = process.env.HOST || '0.0.0.0';

console.log(__dirname)

app.use(express.static(__dirname + '/dist'));

app.use((req, res, next)=>{
    res.sendFile(path.join(__dirname + 'dist/index.html'))
})

const userSocketMap = {};

function getAllConnectedClients (roomId){
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId)=>{
        return {
            socketId,
            username: userSocketMap[socketId]
        }
    });
}

io.on('connection', (socket)=>{
    console.log("Socket Connected", socket.id);
    socket.on(ACTIONS.JOIN, ({roomId, username}) =>{
        userSocketMap[socket.id] = username;
        socket.join(roomId);
        const clients = getAllConnectedClients(roomId);
        clients.forEach(({socketId})=>{
            io.to(socketId).emit(ACTIONS.JOINED, {
                clients, 
                username,
                socketId : socket.id
            });
        })
    })

    socket.on(ACTIONS.CODE_CHANGE, ({roomId, code})=>{
        socket.in(roomId).emit(ACTIONS.CODE_CHANGE, {
            code
        })
    })

    socket.on(ACTIONS.SYNC_CODE, ({code, socketId})=>{
        io.to(socketId).emit(ACTIONS.CODE_CHANGE, {
            code
        })
    })

    socket.on('disconnecting', ()=>{
        const rooms = [...socket.rooms];
        rooms.forEach((roomId)=>{
            socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
                socketId: socket.id,
                username: userSocketMap[socket.id]
            })
        })
        delete userSocketMap[socket.id];
        socket.leave();

    })
})

server.listen(port, ()=>{
    console.log("Server Listening");
})


