import { useState, useRef, useEffect, type ChangeEvent } from "react";
import ReportPreview from "./ReportPreview";
import { readFile, validateFile } from "../../../utils/utils";
import type { CoordinateData, ErrorMessage } from "../../../types";
import { uploadReports } from "../../../utils/uploadReports";
import { CustomError } from "../../../../../components/error/CustomError";
import { Notifications } from "./Notifications";
import "../../../styles/report-form.css";
import LoadingScreen from "../../../../../components/LoadingScreen";

export default function ReportForm() {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [coordinates, setCoordinates] = useState<CoordinateData | null>(null);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!imageUrl) return;

    return () => {
      URL.revokeObjectURL(imageUrl);
    };
  }, [imageUrl]);

  async function processImage(param: File) {
    setIsLoading(true);
    const start = Date.now();
    try {
      validateFile(param);
      setFile(param);
      const data = await readFile(param);
      if (!data) return;
      const url = URL.createObjectURL(param);
      setCoordinates({
        ...data,
      });
      setImageUrl(url);
    } catch (err) {
      if (err instanceof CustomError) {
        setErrorMessage({ type: err.code, message: err.message });
        return;
      } else {
        setErrorMessage({
          type: "UNKNOWN_ERROR",
          message: "An unknown error occurred while processing the image.",
        });
        console.error(err);
      }
    } finally {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, 3000 - elapsed);

      setTimeout(() => {
        setIsLoading(false);
      }, remaining);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    if (!file || !coordinates) {
      setErrorMessage({
        type: "MISSING_DATA",
        message: "File or exif metadata is missing.",
      });
      return;
    }
    try {
      const fileCopy = file;
      const coordsCopy = coordinates;

      const formData = new FormData();
      formData.append("file", fileCopy);
      formData.append("coordinates", JSON.stringify(coordsCopy));

      const severityInput = e.currentTarget.querySelector<HTMLInputElement>(
        'input[name="severity"]:checked',
      );
      if (severityInput) {
        formData.append("severity", severityInput.value);
      }

      const results = await uploadReports("/api/v1/reports", formData);
      if (!results.success) {
        setErrorMessage({
          type: "SERVER_ERROR",
          message: results.message || "Failed to upload report.",
        });
        throw new CustomError("SERVER_ERROR", results.message);
      }
      // Only clear on success
      setFile(null);
      setImageUrl(null);
      setCoordinates(null);
      console.log("Upload successful:", results);
    } catch (error) {
      if (error instanceof CustomError) {
        setErrorMessage({ type: error.code, message: error.message });
        return;
      } else {
        console.error("Error uploading report:", error);
      }
    } finally {
      setIsLoading(false);
    }
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    if (files.length > 0) {
      const file = files[0];
      setIsLoading(true);
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
      setIsLoading(true);
      processImage(file);
    }
  }
  return (
    <>
      <div className="form-container report-upload-form">
        <form
          onSubmit={handleSubmit}
          className="report-form"
          encType="multipart/form-data"
        >
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
          {isLoading ? (
            <LoadingScreen category="image" />
          ) : (
            file &&
            imageUrl &&
            coordinates && (
              <ReportPreview url={imageUrl} coordinateData={coordinates} />
            )
          )}
          <button className="submit-button" disabled={!file || !coordinates}>
            submit
          </button>
        </form>
        {isLoading ? (
          <LoadingScreen category="notification" />
        ) : (
          errorMessage && (
            <Notifications message={errorMessage} func={setErrorMessage} />
          )
        )}
      </div>
    </>
  );
}
