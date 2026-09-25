import SearchListSection from "./components/SearchListSection";
import "../../styles/resloveReport.css";
import type {
  CoordinateData,
  ListItemOptional,
  NotificationType,
  Report,
} from "../../types";
import {
  useContext,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type SubmitEvent,
} from "react";
import {
  isInNairobi,
  readFile,
  resolveData,
  validateFile,
} from "../../utils/utils";
import { CustomError } from "../../../../components/error/CustomError";
import { MapContext } from "../../../../context/createMapContext";
import LoadingScreen from "../../../../components/LoadingScreen";
import { Notifications } from "./components/Notifications";
import resolveIssues from "../../utils/resolveIssues";
import { ReportContext } from "../../../../context/createReportContext";
import ReportPreview from "./components/ReportPreview";

export default function ResolveReport(props: ListItemOptional) {
  const isResolving = true;
  const [interestedReport, setInterestedReport] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<CoordinateData | null>(null);
  const [isResponseLoading, setIsResponseLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const imagePreviewUrl = useRef<string | null>(null);
  const {
    nairobiSubCountyShapefile,
    setIsNotInNairobi,
    setInitialReportCoordinates,
  } = useContext(MapContext)!;
  const { isLoading: isReportLoading, setNotification: setGlobalNotification } =
    useContext(ReportContext)!;
  const [notification, setNotification] = useState<NotificationType | null>(
    null,
  );
  const { setCollapsed } = props;

  useEffect(() => {
    if (notification && notificationRef.current) {
      notificationRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [notification]);

  function resetPreview() {
    if (imagePreviewUrl.current) {
      URL.revokeObjectURL(imagePreviewUrl.current);
      imagePreviewUrl.current = null;
    }
    setFile(null);
    setImageUrl(null);
    setCoordinates(null);
    setIsLoading(false);
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
      setCollapsed(true);
      setGlobalNotification({
        type: "Info",
        message: "Drag the marker and confirm the coordinates of the report.",
      });
    }
    setCoordinates(coords);
    setInitialReportCoordinates({
      lat: coords.GPSLatitude,
      lng: coords.GPSLongitude,
    });
  }

  async function processImage(param: File) {
    if (!interestedReport) {
      return;
    }
    setIsLoading(true);
    try {
      const { fileType, isValid } = validateFile(param);
      if (!isValid) {
        throw new CustomError(
          "INVALID_FILE_TYPE",
          `Please upload a JPG, PNG, or WEBP image. Received: ${fileType}`,
        );
      }
      const data = await readFile(param);

      if (!nairobiSubCountyShapefile.current) return;
      const within = isInNairobi(
        data.GPSLatitude,
        data.GPSLongitude,
        nairobiSubCountyShapefile.current,
      );
      if (!within) {
        setIsNotInNairobi(true);
        throw new CustomError(
          "LOCATION_MISMATCH",
          "Reports must be located within Nairobi County.",
        );
      }
      setFile(param);

      createPreview(param);

      // Validate Resolution Location
      resolveData(
        {
          GPSLongitude: interestedReport.location.coordinates[0],
          GPSLatitude: interestedReport.location.coordinates[1],
          DateTimeOriginal: interestedReport.dateTaken!,
        },
        data,
      );
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
      } else {
        setNotification({
          code: "UNKNOWN_ERROR",
          message: "An unknown error occurred while processing the image.",
          type: "Error",
        });
        console.error(err);
      }
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

    setIsResponseLoading(true);
    try {
      if (!interestedReport) {
        throw new CustomError(
          "MISSING_REPORT",
          "No report selected for resolution.",
        );
      }

      if (!file) {
        throw new CustomError("MISSING_FILE", "Image file is missing.");
      }

      if (!coordinates) {
        throw new CustomError(
          "NO_EXIF_DATA",
          "EXIF metadata is missing or incomplete.",
        );
      }

      const coordsCopy = coordinates;
      const fileCopy = file;
      const { _id } = interestedReport;

      const formData = new FormData(e.currentTarget);
      formData.append("coordinates", JSON.stringify(coordsCopy));
      formData.append("_id", _id);
      formData.append("file", fileCopy);

      const results = await resolveIssues(
        "https://crackspots-server.onrender.com/api/v1/resolve",
        formData,
      );

      if ("success" in results && results.success) {
        setNotification({
          type: "Success",
          message: `Upload successful: ${results.message}.`,
        });
      }
      // Only clear on success
      resetPreview();
      setInterestedReport(null);
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
      setIsResponseLoading(false);
    }
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target?.files?.[0];
    if (file) {
      processImage(file);
    }
  }
  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
  }
  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    if (e.dataTransfer) {
      const file = e.dataTransfer.files[0];
      if (file) {
        processImage(file);
      }
    }
  }

  return (
    <div className="resolve-reports-container">
      <p>Select the issue to resolve</p>
      <SearchListSection
        setCollapsed={props.setCollapsed}
        isResolving={isResolving}
        setInterestedReport={setInterestedReport}
        interestedReport={interestedReport}
      />
      {interestedReport && (
        <div className="interested-report-details">
          <form onSubmit={handleSubmit} className="report-form">
            <fieldset>
              <legend>Upload Image for Verification</legend>
              {file ? (
                <div className="clear-form-container">
                  <button
                    type="reset"
                    title="Clear Form"
                    onClick={resetPreview}
                  >
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
                    id="resolve-upload-file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/jpg, image/jpeg, image/webp, .png, .jpg, .jpeg"
                    hidden
                  />
                  <div className="drop-area-container">
                    <span> Drag & Drop or </span>
                    <label
                      htmlFor="resolve-upload-file"
                      className="upload-file-label"
                    >
                      Take or upload a photo
                    </label>
                  </div>
                </div>
              )}
              <LoadingScreen category="image" condition={isLoading} />
              {file && imageUrl && coordinates && (
                <ReportPreview
                  setCollapsed={props.setCollapsed}
                  setIsLoading={setIsLoading}
                  coordinateData={coordinates}
                  url={imageUrl}
                />
              )}
            </fieldset>
            <fieldset className="repair-quality-fieldset">
              <legend>Repair Quality</legend>
              <select
                name="quality"
                id="repair-quality-input"
                defaultValue={""}
                required
              >
                <option value="" disabled>
                  --Please choose an option--
                </option>
                <option value="temporary">Temporary (Filled with dirt)</option>
                <option value="permanent">Permanent</option>
              </select>
            </fieldset>
            <fieldset>
              <legend>Description note</legend>
              <textarea
                name="note"
                id="resolve-report-description-note"
                rows={5}
                placeholder="Enter a description of the resolution..."
                required={true}
                minLength={5}
                maxLength={100}
              ></textarea>
            </fieldset>
            <button className="submit-report-resolution-btn">Submit</button>
          </form>
        </div>
      )}
      <LoadingScreen category="report" condition={isResponseLoading} />
      {notification && (
        <div className="notifications-scroll-container" ref={notificationRef}>
          <Notifications
            message={notification.message}
            func={setNotification}
            type={notification.type}
          />
        </div>
      )}
    </div>
  );
}
