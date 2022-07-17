import { useState } from 'react';
import styles from './App.module.scss';
import VideoRoom from "./components/VideoRoom/VideoRoom";

function App() {
  const [roomId, setRoomId] = useState(null);
  const [enteredRoomId, setEnteredRoomId] = useState(null);
  console.log({ enteredRoomId });

  const onCloseRoom = () => {
    setRoomId(null);
  };

  const onJoinRoom = () => {
    setRoomId(enteredRoomId);
  };

  const onCreateRoom = () => {
    setRoomId(
      Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
    );
  };

  return (
    <div className={styles.app}>
      {
        !roomId && (
          <div className={styles.roomButtons}>
            <button className={`${styles.button} ${styles.createButton}`} onClick={onCreateRoom}>Create Room</button>
            <div className={styles.roomInputWrap}>
              <input
                className={styles.roomInput}
                onChange={(e) => setEnteredRoomId(e.target.value)}
                placeholder="Enter Room Id"
              />
              <button className={`${styles.button} ${styles.joinButton}`} onClick={onJoinRoom}>Join Room</button>
            </div>
          </div>
        )
      }
      {
        roomId && (
          <VideoRoom roomId={roomId} onCloseRoom={onCloseRoom} />
        )
      }
    </div>
  );
}

export default App;
