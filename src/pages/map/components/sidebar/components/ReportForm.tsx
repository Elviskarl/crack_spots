export interface CoordinateData {
  GPSLatitude: number;
  GPSLongitude: number;
  GPSLatitudeRef: "N" | "S";
  GPSLongitudeRef: "E" | "W";
  DateTimeOriginal: string;
}

import { useState, useRef, useEffect, type ChangeEvent } from "react";
import ReportPreview from "./ReportPreview";
import { readFile, validateFile } from "../../../utils/utils";

export default function ReportForm() {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<CoordinateData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!imageUrl) return;

    return () => {
      URL.revokeObjectURL(imageUrl);
    };
  }, [imageUrl]);

  async function processImage(param: File) {
    try {
      validateFile(param);
      setFile(param);
      const data = await readFile(param);
      if (!data) throw new Error("Invalid Data");
      const url = URL.createObjectURL(param);
      setCoordinates({
        ...data,
      });
      setImageUrl(url);
    } catch (err) {
      console.error(err);
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    try {
      e.preventDefault();
      if (!file || !coordinates) throw new Error("File or coordinates missing");
      const formData = new FormData(e.currentTarget);
      formData.append("coordinates", JSON.stringify(coordinates));
      const severity = formData.get("severity");
      console.log(severity);
      console.log(formData);
    } catch (error) {
      console.error(error);
    } finally {
      e.currentTarget.reset();
      setFile(null);
      setImageUrl(null);
      setCoordinates(null);
    }
  }
  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    if (files.length > 0) {
      const file = files[0];
      processImage(file);
    }
  }
  function handleClick() {
    fileInputRef.current?.click();
  }
  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
  }
  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    if (e.dataTransfer) {
      const filesList = e.dataTransfer.files;
      const file = Array.from(filesList)[0];
      processImage(file);
    }
  }
  return (
    <>
      <div className="form-container report-upload-form">
        <form onSubmit={handleSubmit} className="report-form">
          <div
            className="draggable-container"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input
              type="file"
              name="file"
              id="upload-file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/jpg, image/jpeg, image/webp, .png, .jpg, .jpeg"
            />
            <div className="drop-area-container">
              <span> Drag & Drop or </span>
              <button
                onClick={handleClick}
                className="browse-btn"
                type="button"
              >
                Browse for a file
              </button>
            </div>
          </div>
          {file && imageUrl && coordinates && (
            <ReportPreview url={imageUrl} coordinateData={coordinates} />
          )}
          {file && coordinates && (
            <fieldset>
              <legend>Severity: </legend>
              <label>
                <input
                  type="radio"
                  name="severity"
                  className="damage-severity"
                  value="minor"
                  required
                />
                Minor
              </label>
              <label>
                <input
                  type="radio"
                  name="severity"
                  className="damage-severity"
                  value="moderate"
                  required
                />
                Moderate
              </label>
              <label>
                <input
                  type="radio"
                  name="severity"
                  className="damage-severity"
                  value="extensive"
                  required
                />
                Extensive
              </label>
            </fieldset>
          )}
          <button className="submit-button">submit</button>
        </form>
      </div>
    </>
  );
}
