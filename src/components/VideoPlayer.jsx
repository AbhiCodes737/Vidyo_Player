import React, { useRef, useEffect, useState } from "react";
import WaveSurfer from "wavesurfer.js";

const VideoPlayer = ({ videoFile }) => {
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const wavesurferRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isButtonVisible, setIsButtonVisible] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const drawVideoFrame = () => {
    if (!isPlaying) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    requestAnimationFrame(drawVideoFrame);
  };

  useEffect(() => {
    drawVideoFrame();
  }, [isPlaying]);

  useEffect(() => {
    if (videoFile) {
      const video = document.createElement("video");
      video.src = URL.createObjectURL(videoFile);
      videoRef.current = video;

      const wavesurfer = WaveSurfer.create({
        container: "#waveform",
        waveColor: "violet",
        progressColor: "#b7f564",
        backend: "MediaElement",
        height: 100,
        interact: false,
        barWidth: 3,
      });
      wavesurferRef.current = wavesurfer;

      const handleLoadedData = () => {
        setIsLoading(false);
        wavesurfer.load(video.src);
        wavesurfer.setVolume(0);
      };

      const handleTimeUpdate = () => {
        const newCurrentTime = video.currentTime;
        setCurrentTime(newCurrentTime);
        wavesurfer.seekTo(newCurrentTime / video.duration);
        drawVideoFrame();
      };

      const handleWaveformReady = () => {
        setIsPlaying(true);
        video.play();
      };

      video.addEventListener("loadeddata", handleLoadedData);
      video.addEventListener("timeupdate", handleTimeUpdate);
      wavesurfer.on("ready", handleWaveformReady);

      return () => {
        video.removeEventListener("loadeddata", handleLoadedData);
        video.removeEventListener("timeupdate", handleTimeUpdate);
        wavesurfer.un("ready", handleWaveformReady);

        video.pause();
        video.src = "";
        setIsPlaying(false);
        wavesurfer.destroy();
      };
    }
  }, [videoFile]);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (isPlaying) {
      video.pause();
      wavesurferRef.current.pause();
    } else {
      video.play();
      wavesurferRef.current.play();
      drawVideoFrame();
    }
    setIsPlaying((prevIsPlaying) => !prevIsPlaying);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleMouseEnter = () => {
    setIsButtonVisible(true);
  };

  const handleMouseLeave = () => {
    setIsButtonVisible(false);
  };

  const handleSliderChange = (e) => {
    const newCurrentTime = parseFloat(e.target.value);
    setCurrentTime(newCurrentTime);
    videoRef.current.currentTime = newCurrentTime;
    wavesurferRef.current.seekTo(newCurrentTime / videoRef.current.duration);
  };

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <canvas
          ref={canvasRef}
          width="640"
          height="360"
          style={{
            width: "640px",
            height: "360px",
            borderRadius: "10px",
            boxShadow: "10px 10px 25px rgba(0,0,0,0.3)",
          }}
        />
        {isButtonVisible && (
          <div
            style={{
              zIndex: 2,
            }}
          >
            <button
              onClick={togglePlayPause}
              style={{
                color: "white",
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
                fontSize: "96px",
                position: "absolute",
                top: "40%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              {isPlaying ? (
                <i className="fa fa-pause"></i>
              ) : (
                <i className="fa fa-play"></i>
              )}
            </button>
            <button
              onClick={toggleMute}
              style={{
                color: "white",
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
                fontSize: "24px",
                position: "absolute",
                top: "70%",
                left: "95%",
                transform: "translate(-50%, -50%)",
              }}
            >
              {isMuted ? (
                <i className="fa fa-volume-off"></i>
              ) : (
                <i className="fa fa-volume-up"></i>
              )}
            </button>
            <input
              type="range"
              min="0"
              max={videoRef.current ? videoRef.current.duration : 0}
              step="0.1"
              value={currentTime}
              onChange={handleSliderChange}
              style={{
                width: "85%",
                position: "absolute",
                transform: "translate(-50%, -50%)",
                top: "70%",
                left: "45%",
                accentColor: "#b7f564",
              }}
            />
          </div>
        )}
      </div>
      <div
        id="waveform"
        style={{
          width: "640px",
          height: "100px",
          marginTop: "15px",
        }}
      />
    </div>
  );
};

export default VideoPlayer;
