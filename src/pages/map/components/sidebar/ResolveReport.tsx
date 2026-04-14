import SearchListSection from "./components/SearchListSection";
import "../../styles/resloveReport.css";
import type { CoordinateData, ListItemOptional, Report } from "../../types";
import {
  useContext,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
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
import { ReportContext } from "../../../../context/createReportContext";
import LoadingScreen from "../../../../components/LoadingScreen";
import { Notifications } from "./components/Notifications";
import resolveIssues from "../../utils/resolveIssues";

export default function ResolveReport(props: ListItemOptional) {
  const isResolving = true;
  const [interestedReport, setInterestedReport] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<CoordinateData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const { nairobiSubCountyShapefile, setIsNotInNairobi } =
    useContext(MapContext)!;
  const { notification, setNotification } = useContext(ReportContext)!;

  useEffect(() => {
    if (!imageUrl) return;

    return () => {
      URL.revokeObjectURL(imageUrl);
    };
  }, [imageUrl]);

  useEffect(() => {
    if (!interestedReport) return;
    const resolveReportsContainer = document.querySelector(
      ".resolve-reports-container",
    )!;
    resolveReportsContainer.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [interestedReport]);

  useEffect(() => {
    if (notification && notificationRef.current) {
      notificationRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [notification]);

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

      if (!nairobiSubCountyShapefile.current) return;
      const within = isInNairobi(
        data.GPSLatitude,
        data.GPSLongitude,
        nairobiSubCountyShapefile.current,
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

      // Validate Resolution Location
      if (!interestedReport) {
        return;
      }
      if (!interestedReport?.location) return;

      resolveData(
        {
          GPSLongitude: interestedReport.location.coordinates[0],
          GPSLatitude: interestedReport.location.coordinates[1],
          DateTimeOriginal: interestedReport.dateTaken!,
        },
        { ...data },
      );
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

    try {
      setIsLoading(true);

      if (!interestedReport) {
        console.log("is not interested report");
        throw new CustomError(
          "MISSING_REPORT",
          "No report selected for resolution.",
        );
      }
      if (!file || !coordinates) {
        console.log("is not file | coords");
        throw new CustomError(
          "MISSING_FILE",
          "File or exif metadata is missing.",
        );
      }
      console.log("clicked");
      const fileCopy = file;
      const coordsCopy = coordinates;
      const { _id } = interestedReport;

      const textAreaEl = e.currentTarget.querySelector<HTMLTextAreaElement>(
        'textarea[name="resolve-report-description-note"]',
      );

      const formData = new FormData();
      formData.append("file", fileCopy);
      formData.append("coordinates", JSON.stringify(coordsCopy));
      if (textAreaEl) {
      formData.append("note", textAreaEl.value);
      }
      formData.append("_id", _id);

      console.log(formData);

      const results = await resolveIssues(
        "https://crackspots-server.onrender.com/api/v1/resolve",
        formData,
      );

      setNotification({
        type: "Success",
        message: `Upload successful: ${results.message}.`,
      });
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
      if (!filesList.length) return;
      const file = Array.from(filesList)[0];
      setIsLoading(true);
      processImage(file);
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
              <legend>Upload Image for Verification [Required]</legend>
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
                />
                <div className="drop-area-container">
                  <span> Drag & Drop or </span>
                  <label
                    htmlFor="resolve-upload-file"
                    className="upload-file-label"
                  >
                    Browse for a file
                  </label>
                </div>
              </div>
              {isLoading ? (
                <LoadingScreen category="image" />
              ) : (
                file &&
                imageUrl &&
                coordinates && (
                  <>
                    <div className="image-preview-container">
                      <img
                        src={imageUrl}
                        alt="Road Damage"
                        className="preview-image"
                      />
                    </div>
                    <div className="image-details-container">
                      <table>
                        <caption>Image Metadata</caption>
                        <thead>
                          <tr>
                            <th>Property</th>
                            <th>Value</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>GPS Latitude</td>
                            <td>
                              {interestedReport.location.coordinates[1].toFixed(
                                4,
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td>GPS Longitude</td>
                            <td>
                              {interestedReport.location.coordinates[0].toFixed(
                                4,
                              )}
                            </td>
                          </tr>
                        </tbody>
                        <tfoot>
                          <tr>
                            <td>Date Taken</td>
                            <td>
                              {interestedReport.dateTaken.split(":").join("-")}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </>
                )
              )}
            </fieldset>
            <fieldset>
              <legend>Description note [Required]</legend>
              <textarea
                name="resolve-report-description-note"
                id="resolve-report-description-note"
                rows={5}
                placeholder="Enter a description of the resolution..."
                required={true}
                minLength={5}
              ></textarea>
            </fieldset>
            <button className="submit-report-resolution-btn">Submit</button>
          </form>
        </div>
      )}
      {isLoading ? (
        <LoadingScreen category="notification" />
      ) : (
        notification && (
          <div className="notifications-scroll-container" ref={notificationRef}>
            <Notifications
              message={notification.message}
              func={setNotification}
              type={notification.type}
            />
          </div>
        )
      )}
    </div>
  );
}
