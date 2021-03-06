import { useSelector } from 'react-redux';
import checkUserType from '../../helpers/other/checkUserType.jsx';
import SidebarActiveUser from '../sidebarActiveUser/sidebarActiveUser.jsx';
import s from './sidebarRoomInfo.module.css';

const SidebarRoomInfo = () => {
  const { username, userId, usersList, currentRoomSize, currentRoomName, roomType } =
    useSelector((state) => state);
  return (
    <div className={s.wrapper}>
      <h3 className={s.title}>Active Users</h3>
      <p className={s.online}>
        Online: <span>{currentRoomSize}</span>
      </p>
      <div className={s.listing}>
        {usersList.map((user) => (
          <SidebarActiveUser
            currentRoomName={currentRoomName}
            client={username}
            user={user}
            key={user.socketId}
            type={checkUserType(user.socketId, userId)}
            roomType={roomType}
          />
        ))}
      </div>
    </div>
  );
};

export default SidebarRoomInfo;
