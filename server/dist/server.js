"use strict";
// @ts-ignore
// @ts-ignore
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const dotenv_1 = __importDefault(require("dotenv"));
const socket_io_1 = require("socket.io");
const peer_1 = require("peer");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3030;
const httpServer = http_1.default.createServer(app);
// @ts-ignore
const peerServer = (0, peer_1.ExpressPeerServer)(httpServer);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: '*'
    }
});
// app.use(bodyParser.json());
app.use('/peerjs', peerServer);
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Hello World!' });
});
app.get('/:room', (req, res) => {
    res.status(200).json({ room: req.params.room });
});
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
    socket.on('join', (room, userId) => {
        console.log('user-joined', room, userId);
        socket.join(room);
        socket.to(room).emit('user-joined', { userId });
    });
});
httpServer.listen(port, () => {
    console.log(`🥷 Server listening on ${port}`);
});
//# sourceMappingURL=server.js.map