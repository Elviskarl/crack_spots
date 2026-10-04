import SearchListSection from "./components/SearchListSection";
import "../../styles/resloveReport.css";
import type {
  CoordinateData,
  ListItemOptional,
  NotificationType,
  Report,
} from "../../types";
import { useEffect, useRef, useState } from "react";
import LoadingScreen from "../../../../components/LoadingScreen";
import { Notifications } from "./components/Notifications";
import resolveIssues from "../../utils/resolveIssues";
import ReportPreview from "./components/ReportPreview";
import useMapContext from "../../hooks/getMapContext";
import FormComponent from "./components/FormComponent";
import useReportContext from "../../hooks/getReportsContex";

export default function ResolveReport(props: ListItemOptional) {
  const isResolving = true;
  const [interestedReport, setInterestedReport] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<CoordinateData | null>(null);
  const [isResponseLoading, setIsResponseLoading] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const imagePreviewUrl = useRef<string | null>(null);
  const { setInitialReportCoordinates, correctedReportCoordinates } =
    useMapContext();
  const { setNotification: setGlobalNotification } = useReportContext();
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
    <div className="resolve-reports-container">
      <p>Select the issue to resolve</p>
      <SearchListSection
        setCollapsed={setCollapsed}
        isResolving={isResolving}
        setInterestedReport={setInterestedReport}
        interestedReport={interestedReport}
        resetPreview={resetPreview}
      />
      {imageUrl && reportCoordinates && interestedReport && (
        <ReportPreview
          url={imageUrl}
          coordinateData={reportCoordinates}
          setCollapsed={setCollapsed}
          setIsLoading={setIsLoading}
        />
      )}
      {interestedReport && (
        <FormComponent
          confirmCoordinates={confirmCoordinates}
          createPreview={createPreview}
          resetPreview={resetPreview}
          file={file}
          isResolving={isResolving}
          uploadFunction={resolveIssues}
          isLoading={isLoading}
          onFileProcessed={setFile}
          onNotified={setNotification}
          onResponseLoad={setIsResponseLoading}
          reportCoordinates={reportCoordinates}
          url="https://crackspots-server.onrender.com/api/v1/resolve"
          interestedReport={interestedReport}
          cleanUp={() => setInterestedReport(null)}
          onImageLoad={setIsLoading}
        />
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
