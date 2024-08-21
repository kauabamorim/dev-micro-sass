import { Server } from 'socket.io';

export default function handler(req, res) {
  if (!res.socket.server.io) {
    console.log('Socket is initializing');
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on('connection', (socket) => {
      console.log('Connected:', socket.id);

      socket.on('message', (msg) => {
        socket.broadcast.emit('message', msg);
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
