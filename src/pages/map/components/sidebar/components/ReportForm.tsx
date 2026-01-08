export interface CoordinateData {
  GPSLatitude: number;
  GPSLongitude: number;
  GPSLatitudeRef: "N" | "S";
  GPSLongitudeRef: "E" | "W";
  DateTimeOriginal: string;
}

import { useState, useRef, useEffect, type ChangeEvent } from "react";
import ReportPreview from "./ReportPreview";
import * as ExifReader from "exifreader";

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
      ExifReader.load(file).then((data) => {
        if (
          !data.DateTimeOriginal ||
          !data.GPSLatitude ||
          !data.GPSLatitudeRef ||
          !data.GPSLongitude ||
          !data.GPSLongitudeRef
        )
          return;
        const DateTimeOriginal = data.DateTimeOriginal.description;
        let GPSLatitude = data.GPSLatitude.description;
        let GPSLongitude = data.GPSLongitude.description;
        const GPSLatitudeRef = data.GPSLatitudeRef.value[0] as "N" | "S";
        const GPSLongitudeRef = data.GPSLongitudeRef.value[0] as "E" | "W";

        if (GPSLatitudeRef === "S") GPSLatitude *= -1;
        if (GPSLongitudeRef === "W") GPSLongitude *= -1;

        setCoordinates({
          DateTimeOriginal,
          GPSLatitude: Number(GPSLatitude),
          GPSLatitudeRef,
          GPSLongitude: Number(GPSLongitude),
          GPSLongitudeRef,
        });
      });
      setImageUrl(url);
      setFile(file);
    }
  }
  function handleClick() {
    fileInputRef.current?.click();
  }
  function handleDragOver(e: DragEvent) {
    e.preventDefault();
  }
  function handleDrop(e: DragEvent) {
    e.preventDefault();
    if (e.dataTransfer) {
      const filesList = e.dataTransfer.files;
      const file = Array.from(filesList)[0];
      console.log(file);
    }
  }
  return (
    <>
      <div className="form-container report-upload-form">
        <form action={handleSubmit} className="report-form">
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
              onChange={(e) => handleFileChange(e)}
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
          <button className="submit-button">submit</button>
        </form>
      </div>
    </>
  );
}
