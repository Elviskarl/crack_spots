import {
  useState,
  useRef,
  useEffect,
  type ChangeEvent,
  useContext,
  type SubmitEvent,
  type DragEvent,
} from "react";
import ReportPreview from "./ReportPreview";
import { isInNairobi, readFile, validateFile } from "../../../utils/utils";
import type {
  CoordinateData,
  ListItemOptional,
  NotificationType,
} from "../../../types";
import { uploadReports } from "../../../utils/uploadReports";
import { CustomError } from "../../../../../components/error/CustomError";
import { Notifications } from "./Notifications";
import "../../../styles/report-form.css";
import LoadingScreen from "../../../../../components/LoadingScreen";
import { MapContext } from "../../../../../context/createMapContext";
import { ReportContext } from "../../../../../context/createReportContext";

export default function ReportForm(props: ListItemOptional) {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [coordinates, setCoordinates] = useState<CoordinateData | null>(null);
  const [notification, setNotification] = useState<NotificationType | null>(
    null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imagePreviewUrl = useRef<string | null>(null);
  const {
    nairobiSubCountyShapefile,
    setIsNotInNairobi,
    setInitialReportCoordinates,
    correctedReportCoordinates,
    setCorrectedReportCoordinates,
    setIsCorrecting,
  } = useContext(MapContext)!;

  const { isLoading: isReportLoading, setNotification: setGlobalNotification } =
    useContext(ReportContext)!;
  const { setCollapsed } = props;

  useEffect(() => {
    if (!imageUrl) return;

    return () => {
      URL.revokeObjectURL(imageUrl);
    };
  }, [imageUrl]);

  function resetPreview() {
    if (imagePreviewUrl.current) {
      URL.revokeObjectURL(imagePreviewUrl.current);
      imagePreviewUrl.current = null;
    }
    setFile(null);
    setImageUrl(null);
    setCoordinates(null);
    setInitialReportCoordinates(null);
    setCorrectedReportCoordinates(null);
    setIsCorrecting(false);
  }

  function createPreview(file: File) {
    if (imagePreviewUrl.current) {
      URL.revokeObjectURL(imagePreviewUrl.current);
    }
    const url = URL.createObjectURL(file);
    imagePreviewUrl.current = url;
    setImageUrl(url);
  }

  function confirmCoordinates(coords: CoordinateData) {
    if (setCollapsed) {
      setTimeout(() => {
        setCollapsed(true);
        setGlobalNotification({
          type: "Info",
          message: "Please confirm the coordinates of the report.",
        });
        setIsCorrecting(true);
      }, 1000);
    }
    setCoordinates(coords);
    setInitialReportCoordinates({
      lat: coords.GPSLatitude,
      lng: coords.GPSLongitude,
    });
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

      createPreview(param);
      confirmCoordinates(data);
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

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    if (isReportLoading) {
      setNotification({
        type: "Info",
        message: "Fetching reports from the server. Please wait a moment.",
      });
      return;
    }

    if (!file) {
      setNotification({
        code: "MISSING_DATA",
        message: "Image file is missing.",
        type: "Error",
      });
      return;
    }

    if (!reportCoordinates) {
      setNotification({
        code: "MISSING_METADATA",
        message: "EXIF metadata is missing or incomplete.",
        type: "Error",
      });
      return;
    }

    setIsLoading(true);
    try {
      const coordsCopy = reportCoordinates;
      const fileCopy = file;

      const formData = new FormData(e.currentTarget);

      formData.append("coordinates", JSON.stringify(coordsCopy));
      formData.append("file", fileCopy);
      console.log(formData);

      const results = await uploadReports(
        "https://crackspots-server.onrender.com/api/v1/reports",
        formData,
      );
      if ("success" in results) {
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
  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
  }
  function handleDrop(e: DragEvent<HTMLDivElement>) {
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

  const reportCoordinates =
    correctedReportCoordinates && coordinates
      ? {
          DateTimeOriginal: coordinates.DateTimeOriginal,
          GPSLatitudeRef: coordinates.GPSLatitudeRef,
          GPSLongitudeRef: coordinates.GPSLongitudeRef,
          GPSLatitude: correctedReportCoordinates.lat,
          GPSLongitude: correctedReportCoordinates.lng,
        }
      : coordinates;
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
                hidden
              />
              <div className="drop-area-container">
                <span> Drag & Drop or </span>
                <label htmlFor="upload-file" className="upload-file-label">
                  Take or upload a photo
                </label>
              </div>
            </div>
          )}
          <LoadingScreen category="image" condition={isLoading} />
          {file && imageUrl && reportCoordinates && (
              <ReportPreview
                url={imageUrl}
                coordinateData={reportCoordinates}
              />
            )
          )}
          <button
            className="submit-button"
            type="submit"
            disabled={isCorrecting}
          >
            submit
          </button>
        </form>
        <LoadingScreen category="notification" condition={isResponseLoading} />
        {notification && (
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
