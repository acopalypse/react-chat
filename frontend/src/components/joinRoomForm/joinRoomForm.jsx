import { useSelector } from 'react-redux';
import webSocket from '../../helpers/webSocket.jsx';
import s from './joinRoomForm.module.css';

const JoinRoomForm = () => {
  const { currentRoomName } = useSelector((state) => state);
  const submitHandler = (e) => {
    e.preventDefault();
    const data = {
      currentRoomName,
      roomName: e.target.roomName.value,
      roomProfile: {
        roomType: 'room',
      },
    };
    webSocket.joinRoom(data);
    e.target.reset();
  };
  return (
    <div>
      <h3>Join Room</h3>
      <form className={s.form} onSubmit={submitHandler}>
        <label>
          <span>Room name:</span>
          <input className={s.input} type='text' name='roomName' required />
        </label>
        <button className={s.button} type='submit'>
          Join
        </button>
      </form>
    </div>
  );
};

export default JoinRoomForm;
