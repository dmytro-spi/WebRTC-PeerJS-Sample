import React, { useEffect, useState } from 'react';
import PropTypes from "prop-types";
import styles from "./VideoRoom.module.scss";
import Video from "../Video/Video";
import createPeerConnection from "../../helpers/peerConnections";
import {io} from "socket.io-client";

function VideoRoom({ roomId, onCloseRoom }) {
  const socket = io("ws://localhost:3030");

  const [streams, setStreams] = useState([]);
  const [newStream, setNewStream] = useState(null);

  const addVideoStream = (stream) => {
    const filteredStreams = streams.filter(s => s.id !== stream.id);
    setStreams([...filteredStreams, stream]);
  };

  const connectToNewUser = (userId, stream, peer) => {
    console.log('connecting to new user', { userId, stream });
    const call = peer.call(userId, stream);
    call.on('stream', (userVideoStream) => {
      setNewStream(userVideoStream);
    });
  };

  const ownVideoCb = (peer) => (stream) => {
    setNewStream(stream);
    peer.on('call', (call) => {
      call.answer(stream);
      call.on('stream', (userVideoStream) => {
        setNewStream(userVideoStream);
      });
    });
    socket.on('user-joined', ({ userId }) => {
      console.log('joined!', { userId });
      connectToNewUser(userId, stream, peer);
    });
  }

  useEffect(() => {
    const peer = createPeerConnection();
    peer.on('open', (id) => {
      socket.emit('join', roomId, id);
    });

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(ownVideoCb(peer));

    return () => {
      peer.destroy();
      socket.disconnect();
      streams.forEach(stream => stream.getTracks().forEach(track => track.stop()));
      setStreams([]);
    };
  }, []);

  useEffect(() => {
    if (!newStream) return;

    addVideoStream(newStream);
  }, [newStream]);

  return (
    <div className={styles.videoRoom}>
      <div className={styles.roomInfo}>
        <div className={styles.roomId}>Room ID: {roomId}</div>
        <button className={styles.closeButton} onClick={onCloseRoom}>Close Room</button>
      </div>
      <div className={styles.videoGrid}>
        {streams.map((stream) => (
          <Video key={stream.id} srcObject={stream} />
        ))}
      </div>
    </div>
  );
}

VideoRoom.propTypes = {
  roomId: PropTypes.string.isRequired,
}

export default VideoRoom;
