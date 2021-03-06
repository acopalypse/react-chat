import { io } from 'socket.io-client';
import chatStore from './chatStore.jsx';
import * as type from './actionTypes.jsx';

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
      this.socket.emit('user:createProfile', { username });
      this.socket.on('user:createProfile', (res) => {
        chatStore.dispatch({
          type: type.USER_CONNECT,
          payload: { username, userId: this.socket.id },
        });
      });
      this.socket.once('user:joinRoom', (res) => {
        const { roomData } = res;
        chatStore.dispatch({ type: type.USER_JOIN_ROOM, payload: roomData });
        this._roomUsersListener();
        this._roomMessageListener();
        this._dialogMessageListener(roomData);
      });
    });
  }
  sendMessage(data) {
    this.socket.emit('user:newMessage', data);
  }
  createRoom(data) {
    this.socket.emit('user:createRoom', data);
    this.socket.once('user:joinRoom', (res) => {
      const { roomData } = res;
      chatStore.dispatch({ type: type.USER_JOIN_ROOM, payload: roomData });
      this._dialogMessageListener(roomData);
    });
  }
  joinRoom(data) {
    this.socket.emit('user:joinRoom', data);
    this.socket.once('user:joinRoom', (res) => {
      const { roomData } = res;
      chatStore.dispatch({ type: type.USER_JOIN_ROOM, payload: roomData });
      this._roomMessageListener();
      this._dialogMessageListener(roomData);
    });
  }
  startDialog(data) {
    this.socket.emit('user:startDialog', data);
    this.socket.once('user:startDialog', (res) => {
      const { dialogProfile } = data;
      const { dialogData } = res;
      const roomData = {
        currentRoomName: dialogProfile.currentRoomName,
        roomName: dialogData.roomName,
        roomProfile: {
          roomType: dialogProfile.roomType,
        },
      };
      this.joinRoom(roomData);
    });
  }
  _roomUsersListener() {
    this.socket.removeAllListeners('room:activeUsers');
    this.socket.on('room:activeUsers', (res) => {
      chatStore.dispatch({ type: type.ROOM_ACTIVE_USERS, payload: res });
    });
  }
  _roomMessageListener() {
    this.socket.removeAllListeners('room:newMessage');
    this.socket.on('room:newMessage', (res) => {
      chatStore.dispatch({ type: type.ROOM_NEW_MESSAGE, payload: res });
      if (res.messageData.dialogName) {
        chatStore.dispatch({
          type: type.DIALOG_NEW_MESSAGE,
          payload: res.messageData,
        });
      }
    });
  }
  _dialogMessageListener(roomData) {
    this.socket.removeAllListeners('dialog:newMessage');
    this.socket.on('dialog:newMessage', (res) => {
      const { messageData, roomChecker } = res;
      if (
        roomData.roomName === roomChecker.room &&
        roomData.roomType === roomChecker.type
      ) {
        chatStore.dispatch({ type: type.ROOM_NEW_MESSAGE, payload: res });
      } else {
        chatStore.dispatch({ type: type.DIALOG_NEW_MESSAGE, payload: messageData });
      }
    });
  }
}

export default new WebSocket();
