import Room from '../models/room.js';

const db = {
  rooms: {},
  createRoom(roomProfile) {
    this.rooms[roomProfile.roomName] = new Room(roomProfile);
    return roomProfile.roomName;
  },
};

export default db;