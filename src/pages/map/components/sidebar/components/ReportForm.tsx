import {
  useState,
  useRef,
  useEffect,
  type ChangeEvent,
  useContext,
} from "react";
import ReportPreview from "./ReportPreview";
import { isInNairobi, readFile, validateFile } from "../../../utils/utils";
import type { CoordinateData, NotificationType } from "../../../types";
import { uploadReports } from "../../../utils/uploadReports";
import { CustomError } from "../../../../../components/error/CustomError";
import { Notifications } from "./Notifications";
import "../../../styles/report-form.css";
import LoadingScreen from "../../../../../components/LoadingScreen";
import { MapContext } from "../../../../../context/createMapContext";
import { ReportContext } from "../../../../../context/createReportContext";

export default function ReportForm() {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [coordinates, setCoordinates] = useState<CoordinateData | null>(null);
  const [notification, setNotification] = useState<NotificationType | null>(
    null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { nairobiSubCountyShapefile, setIsNotInNairobi } =
    useContext(MapContext)!;

  const { isLoading: isReportLoading } = useContext(ReportContext)!;

  useEffect(() => {
    if (!imageUrl) return;

    return () => {
      URL.revokeObjectURL(imageUrl);
    };
  }, [imageUrl]);

  function resetPreview() {
    setFile(null);
    setImageUrl(null);
    setCoordinates(null);
  }

  async function processImage(param: File) {
    setIsLoading(true);
    const start = Date.now();
    try {
      const { fileType, isValid } = validateFile(param);
      if (!isValid) {
        resetPreview();
        throw new CustomError(
          "INVALID_FILE_TYPE",
          `Please upload a JPG, PNG, or WEBP image. Received: ${fileType}`,
        );
      }
      const data = await readFile(param);
      const within = isInNairobi(
        data.GPSLatitude,
        data.GPSLongitude,
        nairobiSubCountyShapefile.current!,
      );
      if (!within) {
        setIsNotInNairobi(true);
        resetPreview();
        setNotification({
          type: "Error",
          message: "Reports must be located within Nairobi County.",
        });
        return;
      }
      setFile(param);

      const url = URL.createObjectURL(param);
      setCoordinates({
        ...data,
      });
      setImageUrl(url);
    } catch (err) {
      resetPreview();
      if (err instanceof CustomError) {
        setNotification({
          code: err.code,
          message: err.message,
          type: "Error",
        });
        return;
      } else if (notification) {
        setNotification({
          message: notification.message,
          type: notification.type,
        });
      } else {
        setNotification({
          code: "UNKNOWN_ERROR",
          message: "An unknown error occurred while processing the image.",
          type: "Error",
        });
        console.error(err);
      }
    } finally {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, 500 - elapsed);

      setTimeout(() => {
        setIsLoading(false);
      }, remaining);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (isReportLoading) {
      setNotification({
        type: "Info",
        message: "Fetching reports from the server. Please wait a moment.",
      });
      return;
    }

    setIsLoading(true);

    if (!file) {
      setNotification({
        code: "MISSING_DATA",
        message: "Image file is missing.",
        type: "Error",
      });
      return;
    }

    if (!coordinates) {
      setNotification({
        code: "MISSING_METADATA",
        message: "EXIF metadata is missing or incomplete.",
        type: "Error",
      });
      return;
    }
    try {
      const coordsCopy = coordinates;

      const formData = new FormData(e.currentTarget);
      formData.append("coordinates", JSON.stringify(coordsCopy));

      const results = await uploadReports(
        "https://crackspots-server.onrender.com/api/v1/reports",
        formData,
      );
      if (!results.success) {
        throw new CustomError("SERVER_ERROR", results.message);
      } else {
        setNotification({
          type: "Success",
          message: `Upload successful: ${results.message}.`,
        });
      }
    } catch (error) {
      if (error instanceof CustomError) {
        setNotification({
          code: error.code,
          message: error.message,
          type: "Error",
        });
        return;
      } else {
        setNotification({
          type: "Error",
          message: `Error uploading report: ${error}`,
        });
      }
    } finally {
      // Only clear on success
      resetPreview();
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
  function clearForm() {
    resetPreview();
  }
  return (
    <>
      <div className="form-container report-upload-form">
        <form
          onSubmit={handleSubmit}
          className="report-form"
          encType="multipart/form-data"
        >
          {file ? (
            <div className="clear-form-container">
              <button type="reset" title="Clear Form" onClick={clearForm}>
                clear Form
              </button>
            </div>
          ) : (
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
                <label htmlFor="upload-file" className="upload-file-label">
                  Take or upload a photo
                </label>
              </div>
            </div>
          )}
          {isLoading ? (
            <LoadingScreen category="image" />
          ) : (
            file &&
            imageUrl &&
            coordinates && (
              <ReportPreview url={imageUrl} coordinateData={coordinates} />
            )
          )}
          <button className="submit-button" type="submit">
            submit
          </button>
        </form>
        {isLoading ? (
          <LoadingScreen category="notification" />
        ) : (
          notification && (
            <Notifications
              message={notification.message}
              func={setNotification}
              type={notification.type}
            />
          )
        )}
      </div>
    </>
  );
}
