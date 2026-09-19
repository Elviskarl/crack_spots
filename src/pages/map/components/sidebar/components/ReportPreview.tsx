import type { CoordinateData } from "../../../types/index";
import "../../../styles/report-preview.css";
import editImageUrl from "../../../../../assets/edit.svg";
import { useContext, type Dispatch, type SetStateAction } from "react";
import { MapContext } from "../../../../../context/createMapContext";

interface Params {
  url: string;
  coordinateData: CoordinateData;
  setCollapsed: Dispatch<SetStateAction<boolean>> | undefined;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}
export default function ReportPreview(props: Params) {
  const {
    DateTimeOriginal,
    GPSLatitude,
    GPSLatitudeRef,
    GPSLongitude,
    GPSLongitudeRef,
  } = props.coordinateData;
  const { setCollapsed, setIsLoading } = props;
  const dateTaken = DateTimeOriginal.split(" ");

  const { setInitialReportCoordinates, setIsCorrecting, isCorrecting } =
    useContext(MapContext)!;

  if (!setInitialReportCoordinates) return;

  function handleClick() {
    if (!setCollapsed) return;
    setInitialReportCoordinates({ lat: GPSLatitude, lng: GPSLongitude });
    setIsCorrecting(true);
    setCollapsed(true);
  }
  return (
    <>
      <div className="image-preview-container">
        <img
          src={props.url}
          alt="Road Damage"
          className="preview-image"
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
          }}
        />
      </div>
      <div className="image-details-container">
        <div className="table-container">
          <table>
            <caption>Image Metadata</caption>
            <thead>
              <tr>
                <th scope="col">Property</th>
                <th scope="col">Orientation</th>
                <th scope="col">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>GPS Longitude</td>
                <td className="table-gps-lng-ref">
                  {GPSLongitudeRef === "E"
                    ? "East"
                    : GPSLongitudeRef === "W"
                      ? "West"
                      : null}
                </td>
                <td className="table-gps-lng">{GPSLongitude.toFixed(5)}</td>
              </tr>
              <tr>
                <td>GPS Latitude</td>
                <td className="table-gps-lat-ref">
                  {GPSLatitudeRef === "N"
                    ? "North"
                    : GPSLatitudeRef === "S"
                      ? "South"
                      : null}
                </td>
                <td className="table-gps-lat">{GPSLatitude.toFixed(5)}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td>Date Taken</td>
                <td colSpan={2} className="table-date-taken">
                  {dateTaken[0].split(":").join("-")}
                </td>
              </tr>
            </tfoot>
          </table>
          <button
            className="image-container edit-image-container"
            title="edit"
            onClick={handleClick}
            disabled={isCorrecting}
          >
            <img src={editImageUrl} alt="edit" className="edit-img" />
          </button>
        </div>

        <fieldset>
          <legend>Severity: </legend>
          <label>
            <input
              type="radio"
              name="severity"
              className="damage-severity"
              value="low"
              required
            />
            Minor
          </label>
          <label>
            <input
              type="radio"
              name="severity"
              className="damage-severity"
              value="medium"
              required
            />
            Moderate
          </label>
          <label>
            <input
              type="radio"
              name="severity"
              className="damage-severity"
              value="high"
              required
            />
            Extensive
          </label>
        </fieldset>
      </div>
    </>
  );
}
