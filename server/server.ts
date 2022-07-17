// @ts-ignore
// @ts-ignore

import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { Server } from 'socket.io';
import { ExpressPeerServer } from 'peer';

dotenv.config();

const app = express();
const port = process.env.PORT || 3030;
const httpServer = http.createServer(app)
// @ts-ignore
const peerServer = ExpressPeerServer(httpServer);
const io = new Server(httpServer, {
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
  console.log(`🥷 Server listening on ${port}`)
});
