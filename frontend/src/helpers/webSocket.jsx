import { io } from 'socket.io-client';
import chatStore from './chatStore.jsx';

class WebSocket {
  constructor() {
    this.io = io;
    this.path = '/chat/';
    this.host = '/';
    this.socket = null;
  }
  connect(username) {
    this.socket = io(this.host, { path: this.path });
    this.socket.on('connect', () => {
      const { id } = this.socket;
      this.socket.on('global:getUsers', (usersList) => {
        chatStore.dispatch({ type: 'chat/getUsers', payload: { usersList } });
      });
      this.socket.emit('global:newUser', username);
      chatStore.dispatch({ type: 'user/login', payload: { username, id } });
    });
  }
  disconnect() {}
  createRoom() {}
  leaveRoom() {}
  sendMessage() {}
}

export default new WebSocket();
