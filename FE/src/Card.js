import { useState } from "react";
import classes from "./Card.module.css";
import Button from "./components/Button";

const readableBytes = (bytes) => {
  var i = Math.floor(Math.log(bytes) / Math.log(1024)),
    sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  return (bytes / Math.pow(1024, i)).toFixed(2) * 1 + " " + sizes[i];
};

function Card(props) {
  const [fileName, setFileName] = useState("-");
  const [fileSize, setSizeName] = useState("-");
  const [isError, setIsError] = useState(false);
  const [isUpload, setIsUpload] = useState(false);
  const [file, setFile] = useState("");

  async function uploadFile() {
    const formData = new FormData();
    formData.append("textfile", file);
    if (fileName !== "-") {
      const response = await fetch("http://localhost:5001/importDataFromFile", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setIsUpload(data);
    }
  }

  const addFileHandler = (event) => {
    setIsUpload(false);
    setFile(event.target.files[0]);
    if (event.target.files[0] !== undefined) {
      if (event.target.files[0].name.slice(-4) === ".txt") {
        setIsError(false);
        setFileName(event.target.files[0].name);
        setSizeName(readableBytes(event.target.files[0].size));
      } else {
        setIsError(true);
        setFileName("-");
        setSizeName("-");
        event.target.value = "";
      }
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.title}>Upload</div>
      <div className={classes.info}>
        <div>File name: {fileName}</div>
        <div>File size: {fileSize}</div>
      </div>
      <label htmlFor="textfile" className={classes["custom-file"]}>
        Select TXT file
      </label>
      <input
        onChange={addFileHandler}
        accept=".txt"
        name="textfile"
        id="textfile"
        type="file"
      />
      {isError && (
        <div style={{ color: "red" }}>Only .txt files are supported</div>
      )}
      <Button sendData={uploadFile}>Confirm</Button>
      {isUpload && (
        <div style={{ color: "query" in isUpload ? "green" : "red" }}>
          {"query" in isUpload ? "Success!" : "ERROR, Try again later" }
        </div>
      )}
    </div>
  );
}

export default Card;
