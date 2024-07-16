import React, { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player/lazy";
import { FaVolumeMute as Muted, FaVolumeUp as Unmuted } from "react-icons/fa";

import video from "../../Assets/rickroll.mp4";
import "./ad.css";

const VideoAdvertisement = () => {
  const videoRef = useRef(null); // Reference to the video element
  const [muted, setMuted] = useState(true); // State to track video playback
  //   const videoPath = process.env.PUBLIC_URL + "/assets/sample.mp4";
  //   const videoPath = process.env.PUBLIC_URL + "/assets/sample.mp4";

  useEffect(() => {}, []);

  return (
    <div className="video-ad-container">
      {muted ? (
        <div
          onClick={() => {
            setMuted(false);
          }}
          className="mute-unmute"
        >
          <Muted />
          <p>click to unmute</p>
        </div>
      ) : (
        <div
          onClick={() => {
            setMuted(true);
          }}
          className="mute-unmute"
        >
          <Unmuted />
          <p>click to mute</p>
        </div>
      )}
      <ReactPlayer width={"100%"} muted={muted} playing={true} url={video} />
    </div>
  );
};

export default VideoAdvertisement;
