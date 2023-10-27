import { Server } from 'socket.io';

import { passport } from '../services/passport-config.js'

let io = null;

export function initialize(server){

  io = new Server(server, {
    cors: {
      origin: "*",
      methods: "*",
    }
  });

  io.use((socket, next) => {
    try{
      console.log("auth check sockets");
      passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err || !user) {
          console.log("auth error sockets", err, user);
          socket.disconnect(true); 
        }
        console.log("auth success sockets");
        socket.user = user; 
        next();
      })(socket.request, socket.request.res, next);
    }catch(err){
      console.log(`Возникла ошибка в сокетах  при авторизации: ${err}`);
      socket.disconnect(true); 
    }
  });

  io.on('connection', (socket) => {
    console.log('Auth client connected');

    socket.on('disconnect', () => {
      console.log('Auth client disconnected');
    });

    socket.on('error', (error) => {
      // Handle connection error
      console.error('Socket error:', error.message);
    });
    
    socket.on('connect_timeout', (timeout) => {
      // Handle connection timeout
      console.error('Connection timeout:', timeout);
    });
  });
} 

export function notifyNewNews() {
  io.emit('notification', 'new News Arrived !');
}