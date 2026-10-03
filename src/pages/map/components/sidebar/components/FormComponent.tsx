import {
  useId,
  type ChangeEvent,
  type DragEvent,
  type SubmitEvent,
} from "react";
import LoadingScreen from "../../../../../components/LoadingScreen";
import useMapContext from "../../../hooks/getMapContext";
import { CustomError } from "../../../../../components/error/CustomError";
import useProcessImage from "../../../hooks/processImage";
import type {
  CoordinateData,
  NotificationType,
  Report,
  ResolveIssuesResponse,
  UploadResponse,
} from "../../../types";
import useReportContext from "../../../hooks/getReportsContex";
import { severityValues } from "../../../data";
import { resolveData } from "../../../utils/utils";

interface FormComponentProps {
  file: File | null;
  onFileProcessed: (file: File) => void;
  createPreview: (file: File) => void;
  resetPreview: () => void;
  confirmCoordinates: (data: CoordinateData) => void;
  onNotified: (notification: NotificationType) => void;
  onResponseLoad: (isLoading: boolean) => void;
  reportCoordinates: CoordinateData | null;
  cleanUp?: () => void;
  uploadFunction: (
    url: string,
    formData: FormData,
  ) => Promise<UploadResponse | ResolveIssuesResponse>;
  isLoading: boolean;
  isResolving: boolean;
  url: string;
  interestedReport?: Report;
}

export default function FormComponent({
  createPreview,
  resetPreview,
  onFileProcessed,
  file,
  confirmCoordinates,
  onNotified,
  onResponseLoad,
  reportCoordinates,
  uploadFunction,
  isLoading,
  isResolving,
  url,
  interestedReport,
  cleanUp,
}: FormComponentProps) {
  const { isCorrecting } = useMapContext();
  const { isLoading: isReportLoading } = useReportContext();
  const { processImage } = useProcessImage();
  const fileInputId = useId();

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.currentTarget.files?.[0];
    if (file) {
      await processFile(file);
    }
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
  }
  async function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0];
    if (file) {
      await processFile(file);
    }
  }

  async function processFile(file: File) {
    try {
      const { data, resizedImage } = await processImage({ file });

      if (isResolving && interestedReport) {
        console.log("resolving");

        resolveData(
          {
            GPSLongitude: interestedReport.location.coordinates[0],
            GPSLatitude: interestedReport.location.coordinates[1],
            DateTimeOriginal: interestedReport.dateTaken,
          },
          data,
        );
      }
      onFileProcessed(resizedImage);
      createPreview(resizedImage);
      confirmCoordinates(data);
    } catch (err) {
      resetPreview();
      if (err instanceof CustomError) {
        onNotified({
          code: err.code,
          message: err.message,
          type: "Error",
        });
        return;
      } else {
        onNotified({
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
      onNotified({
        type: "Info",
        message: "Fetching reports from the server. Please wait a moment.",
      });
      return;
    }

    onResponseLoad(true);
    try {
      if (!file) {
        throw new CustomError("MISSING_FILE", "Image file is missing.");
      }

      if (!reportCoordinates) {
        throw new CustomError(
          "NO_EXIF_DATA",
          "EXIF metadata is missing or incomplete.",
        );
      }

      const formData = new FormData(e.currentTarget);

      formData.append("coordinates", JSON.stringify(reportCoordinates));
      formData.append("file", file);

      if (interestedReport) {
        formData.append("_id", interestedReport._id);
      }

      const results = await uploadFunction(url, formData);
      if ("success" in results) {
        onNotified({
          type: "Success",
          message: `Upload successful: ${results.message}.`,
        });
      }
    } catch (error) {
      if (error instanceof CustomError) {
        onNotified({
          code: error.code,
          message: error.message,
          type: "Error",
        });
        return;
      } else {
        onNotified({
          type: "Error",
          message: `Error uploading report: ${error}`,
        });
      }
    } finally {
      // Only clear on success
      resetPreview();
      onResponseLoad(false);
      if (cleanUp) {
        cleanUp();
      }
    }
  }
  return (
    <form
      onSubmit={handleSubmit}
      className="report-form"
      encType="multipart/form-data"
    >
      <div
        className="draggable-container"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        hidden={reportCoordinates ? true : false}
      >
        <input
          type="file"
          //   name="file"
          id={fileInputId}
          onChange={handleFileChange}
          accept="image/jpg, image/jpeg, image/webp, .png, .jpg, .jpeg"
          hidden
        />
        <div className="drop-area-container">
          <span> Drag & Drop or </span>
          <label htmlFor={fileInputId} className="upload-file-label">
            Take or upload a photo
          </label>
        </div>
      </div>

      <LoadingScreen category="image" condition={isLoading} />
      {reportCoordinates &&
        (isResolving ? (
          <>
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
          </>
        ) : (
          <fieldset>
            <legend>Severity: </legend>
            {severityValues.map(({ label, value }) => (
              <label key={label} className="damage-severity-label">
                <input
                  type="radio"
                  name="severity"
                  className="damage-severity"
                  value={value}
                  required
                />
                {label}
              </label>
            ))}
          </fieldset>
        ))}
      <div className="form-container-buttons">
        <button
          type="reset"
          title="Clear Form"
          onClick={resetPreview}
          className="clear-form-button"
          hidden={reportCoordinates ? false : true}
        >
          clear Form
        </button>
        <button className="submit-button" type="submit" disabled={isCorrecting}>
          submit
        </button>
      </div>
    </form>
  );
}
