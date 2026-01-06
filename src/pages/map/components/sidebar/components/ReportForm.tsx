import { useState, useRef, type ChangeEvent } from "react";
import ReportPreview from "./ReportPreview";

export default function ReportForm() {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  function handleSubmit(formData: FormData) {
    const imageData = formData.get("file");
    console.log(imageData);
  }
  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    if (files.length > 0) {
      const file = files[0];
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      setFile(file);
    }
  }
  function handleClick() {
    fileInputRef.current?.click();
  }
  return (
    <>
      <div className="form-container report-upload-form">
        <form action={handleSubmit} className="report-form">
          <div className="draggable-container">
            <input
              type="file"
              name="file"
              id="upload-file"
              ref={fileInputRef}
              onChange={(e) => handleFileChange(e)}
            />
            <div className="drop-area-container">
              <span> Drag & Drop or </span>
              <button onClick={handleClick} className="browse-btn">
                Browse for a file
              </button>
            </div>
          </div>
          <button className="submit-button">submit</button>
        </form>
      </div>
      {file && <ReportPreview url={imageUrl} />}
    </>
  );
}
