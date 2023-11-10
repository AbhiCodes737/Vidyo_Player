import React from "react";
import VideoPlayer from "./VideoPlayer";
import Metadata from "./Metadata";

export default function Input() {
  const [dragActive, setDragActive] = React.useState(false);
  const [uploadedFile, setUploadedFile] = React.useState(null);
  const [playVideo, setPlayVideo] = React.useState(false);

  const inputRef = React.useRef(null);

  const handleDrag = function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = function (e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadedFile(e.dataTransfer.files[0]);
      setPlayVideo(true);
    }
  };

  const handleChange = function (e) {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
      setPlayVideo(true);
    }
  };

  const onButtonClick = () => {
    inputRef.current.click();
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignContent: "center",
          justifyContent: "center",
        }}
      >
        <form
          id="form-file-upload"
          onDragEnter={handleDrag}
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            ref={inputRef}
            type="file"
            id="input-file-upload"
            accept="video/*"
            onChange={handleChange}
          />
          <label
            id="label-file-upload"
            htmlFor="input-file-upload"
            className={dragActive ? "drag-active" : ""}
          >
            <div>
              <p>Drag and drop the video file here or</p>
              <button className="upload-button" onClick={onButtonClick}>
                Choose a video file
              </button>
              {uploadedFile && <p>Uploaded file: {uploadedFile.name}</p>}
            </div>
          </label>
          {dragActive && (
            <div
              id="drag-file-element"
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            ></div>
          )}
        </form>
      </div>
      <div
        style={{
          marginTop: "70px",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          gap: "100px",
        }}
      >
        {playVideo && <VideoPlayer videoFile={uploadedFile} />}
        {uploadedFile && <Metadata videoFile={uploadedFile} />}
      </div>
    </div>
  );
}
