import {
  useId,
  type ChangeEvent,
  type DragEvent,
  type SubmitEvent,
} from "react";
// components
import LoadingScreen from "../../../../../components/LoadingScreen";
// Errors
import { CustomError } from "../../../../../components/error/CustomError";
// data
import { severityValues } from "../../../data";
// helper Fn
import { resolveData } from "../../../utils/utils";
// hooks
import useReports from "../../../hooks/useReports";
import useProcessImage from "../../../hooks/processImage";
import useCreateReport from "../../../hooks/useCreateReport";
// context
import useMapContext from "../../../hooks/getMapContext";
// styles
import "../../../styles/formComponent.css";
// types
import type {
  CreateFormComponentProps,
  ResolveFormComponentProps,
} from "../../../types";
import useResolveReport from "../../../hooks/useResolveReport";

export default function FormComponent(
  props: CreateFormComponentProps | ResolveFormComponentProps,
) {
  const { isCorrecting } = useMapContext();
  const { processImage } = useProcessImage();
  const fileInputId = useId();
  const { isLoading: isReportLoading } = useReports();
  const {
    createPreview,
    resetPreview,
    onFileProcessed,
    file,
    confirmCoordinates,
    onNotified,
    reportCoordinates,
    isLoading,
    url,
    cleanUp,
    onImageLoad,
    mode,
  } = props;
  const createReportMutation = useCreateReport(onNotified);
  const resolveReportMutation = useResolveReport(onNotified);

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
    onImageLoad(true);
    try {
      const { data, resizedImage } = await processImage({ file });

      if (mode === "Resolve") {
        resolveData(
          {
            GPSLongitude: props.interestedReport.location.coordinates[0],
            GPSLatitude: props.interestedReport.location.coordinates[1],
            DateTimeOriginal: props.interestedReport.dateTaken,
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

      if (mode === "Resolve") {
        formData.append("_id", props.interestedReport._id);
        await resolveReportMutation.mutateAsync({ url, formData });
      } else {
        await createReportMutation.mutateAsync({ url, formData });
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
        hidden={isLoading || !!reportCoordinates}
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
          <span className="drop-area-text"> Drag & Drop or </span>
          <label htmlFor={fileInputId} className="upload-file-label">
            Take or upload a photo
          </label>
        </div>
      </div>

      <LoadingScreen category="image" condition={isLoading} />
      {reportCoordinates &&
        (mode === "Resolve" ? (
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
        <button
          className="submit-button"
          type="submit"
          disabled={
            isCorrecting ||
            createReportMutation.isPending ||
            resolveReportMutation.isPending
          }
        >
          submit
        </button>
      </div>
    </form>
  );
}
