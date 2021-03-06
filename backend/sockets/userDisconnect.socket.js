import db from './db.socket.js';

const userDisconnect = (socket) => {
  const roomsArr = Array.from(socket.rooms);
  roomsArr.forEach((roomName) => {
    db.rooms[roomName]?.disconnect(socket.id);
  });
};

export default userDisconnect;
