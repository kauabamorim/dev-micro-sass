import { NextApiRequest, NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";

type NextApiResponseWithSocket = NextApiResponse & {
  socket: {
    server: HTTPServer & {
      io?: SocketIOServer;
    };
  };
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  if (!res.socket.server.io) {
    console.log('Socket is initializing');
    const io = new SocketIOServer(res.socket.server, {
      path: '/api/socket',
    });
    res.socket.server.io = io;

    io.on('connection', (socket) => {
      console.log('Connected:', socket.id);

      socket.on('message', (message) => {
        console.log('Message received:', message);
        socket.broadcast.emit('message', message);
      });

      socket.on('disconnect', () => {
        console.log('Disconnected:', socket.id);
      });
    });
  } else {
    console.log('Socket is already running');
  }
  res.end();
}
