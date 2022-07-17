import { Peer } from "peerjs";


const createPeerConnection = () => {
  return new Peer({
    path: "/peerjs",
    host: "localhost",
    port: 3030,
  });
}

export default createPeerConnection;
