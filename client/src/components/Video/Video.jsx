import { useEffect, useRef } from "react";
import styles from "./Video.module.scss";

function Video({ srcObject, ...props }) {
  const refVideo = useRef(null)

  useEffect(() => {
    if (!refVideo.current) return
    refVideo.current.srcObject = srcObject
  }, [srcObject])

  return <video className={styles.video} ref={refVideo} autoPlay {...props} />
}

export default Video;
