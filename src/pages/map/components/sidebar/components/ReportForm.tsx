import { useState, useRef, useContext, useMemo } from "react";
import ReportPreview from "./ReportPreview";
import type {
  CoordinateData,
  ListItemOptional,
  NotificationType,
} from "../../../types";
import { uploadReports } from "../../../utils/uploadReports";
import { Notifications } from "./Notifications";
import "../../../styles/report-form.css";
import LoadingScreen from "../../../../../components/LoadingScreen";
import { ReportContext } from "../../../../../context/createReportContext";
import useMapContext from "../../../hooks/getMapContext";
import FormComponent from "./FormComponent";

export default function ReportForm(props: ListItemOptional) {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [coordinates, setCoordinates] = useState<CoordinateData | null>(null);
  const [notification, setNotification] = useState<NotificationType | null>(
    null,
  );
  const [isResponseLoading, setIsResponseLoading] = useState(false);
  const imagePreviewUrl = useRef<string | null>(null);

  const {
    setInitialReportCoordinates,
    correctedReportCoordinates,
    setCorrectedReportCoordinates,
    setIsCorrecting,
  } = useMapContext();

  const { setNotification: setGlobalNotification } = useContext(ReportContext)!;
  const { setCollapsed } = props;

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
    if (!setCollapsed) return;
    setCollapsed(true);
    setGlobalNotification({
      type: "Info",
      message: "Drag the marker and confirm the coordinates of the report.",
    });
    setCoordinates(coords);
    setInitialReportCoordinates({
      lat: coords.GPSLatitude,
      lng: coords.GPSLongitude,
    });
  }

  const reportCoordinates = useMemo(() => {
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

    return reportCoordinates;
  }, [correctedReportCoordinates, coordinates]);

  return (
    <>
      {imageUrl && reportCoordinates && (
        <ReportPreview
          url={imageUrl}
          coordinateData={reportCoordinates}
          setCollapsed={setCollapsed}
          setIsLoading={setIsLoading}
        />
      )}
      <FormComponent
        confirmCoordinates={confirmCoordinates}
        createPreview={createPreview}
        resetPreview={resetPreview}
        file={file}
        reportCoordinates={reportCoordinates}
        onResponseLoad={setIsResponseLoading}
        onFileProcessed={setFile}
        isLoading={isLoading}
        onNotified={setNotification}
        uploadFunction={uploadReports}
        isResolving={false}
        url="https://crackspots-server.onrender.com/api/v1/reports"
      />

      <div className="form-container report-upload-form">
        <LoadingScreen category="report" condition={isResponseLoading} />
        {notification && (
          <Notifications
            message={notification.message}
            func={setNotification}
            type={notification.type}
          />
        )}
      </div>
    </>
  );
}
