import React, { useEffect, useState } from "react";

const Metadata = ({ videoFile }) => {
  const [metadata, setMetadata] = useState(null);

  useEffect(() => {
    if (videoFile) {
      const video = document.createElement("video");
      video.src = URL.createObjectURL(videoFile);

      video.addEventListener("loadedmetadata", () => {
        const mediaMetadata = new MediaMetadata({
          title: videoFile.name,
        });

        setMetadata({
          duration: video.duration,
          height: video.videoHeight,
          width: video.videoWidth,
          releaseDate: videoFile.lastModifiedDate || "---",
        });

        URL.revokeObjectURL(video.src);
      });
    }
  }, [videoFile]);

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  function trimFileName(fileName) {
    if (fileName.length > 40) {
      return fileName.substring(0, 40);
    } else {
      return fileName;
    }
  }
  return (
    <div
      id="metadata"
      style={{
        borderRadius: "10px",
        backgroundColor: "#b7f564",
        padding: "20px",
      }}
    >
      {metadata && (
        <div>
          <h2>VIDEO METADATA:</h2>
          <div style={{ fontSize: "24px" }}>
            <i className="fa fa-file"></i> <b>File Name: </b>
            {trimFileName(videoFile.name)}
            <br />
            <i className="fa fa-file-archive-o"></i> <b>File Size: </b>
            {videoFile.size} bytes
            <br />
            <i className="fa fa-clock-o"></i> <b>Duration: </b>
            {formatDuration(metadata.duration)} min
            <br />
            <i className="fa fa-arrows-v"></i> <b>Original Height: </b>
            {metadata.height} px
            <br />
            <i className="fa fa-arrows-h"></i> <b>Original Width: </b>
            {metadata.width} px
            <br />
            <i className="fa fa-calendar"></i> <b>Release Date: </b>
            {metadata.releaseDate.toDateString()}
            <br />
          </div>
        </div>
      )}
    </div>
  );
};

export default Metadata;
