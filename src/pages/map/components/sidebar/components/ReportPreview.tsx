import type { CoordinateData } from "../../../types/index";

interface Params {
  url: string;
  coordinateData: CoordinateData;
}
export default function ReportPreview(props: Params) {
  const {
    DateTimeOriginal,
    GPSLatitude,
    GPSLatitudeRef,
    GPSLongitude,
    GPSLongitudeRef,
  } = props.coordinateData;
  const dateTaken = DateTimeOriginal.split(" ");
  return (
    <>
      <div className="image-preview-container">
        <img src={props.url} alt="Road Damage" className="preview-image" />
      </div>
      <div className="image-details-container">
        <table>
          <caption>Image Metadata</caption>
          <thead>
            <tr>
              <th>Property</th>
              <th>Value</th>
              <th>Orientation</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>GPS Latitude</td>
              <td>{GPSLatitude.toFixed(4)}</td>
              <td>{GPSLatitudeRef}</td>
            </tr>
            <tr>
              <td>GPS Longitude</td>
              <td>{GPSLongitude.toFixed(4)}</td>
              <td>{GPSLongitudeRef}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td>Date Taken</td>
              <td>{dateTaken[0].split(":").join("-")}</td>
              <td>N/A</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  );
}
