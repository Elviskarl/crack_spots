import * as ExifReader from "exifreader";
import type { CoordinateData } from "../components/sidebar/components/ReportForm";

export async function readFile(
  param: File
): Promise<CoordinateData | undefined> {
  try {
    const data = await ExifReader.load(param);
    if (
      !data.DateTimeOriginal ||
      !data.GPSLatitude ||
      !data.GPSLatitudeRef ||
      !data.GPSLongitude ||
      !data.GPSLongitudeRef
    )
      return;
    const DateTimeOriginal = data.DateTimeOriginal.description;
    let GPSLatitude = Number(data.GPSLatitude.description);
    let GPSLongitude = Number(data.GPSLongitude.description);
    const GPSLatitudeRef = data.GPSLatitudeRef.value as string[];
    const GPSLongitudeRef = data.GPSLongitudeRef.value as string[];

    if (GPSLatitudeRef[0] === "S") GPSLatitude *= -1;
    if (GPSLongitudeRef[0] === "W") GPSLongitude *= -1;
    return {
      DateTimeOriginal,
      GPSLatitude,
      GPSLongitude,
      GPSLatitudeRef: GPSLatitudeRef[0] as "N" | "S",
      GPSLongitudeRef: GPSLongitudeRef[0] as "E" | "W",
    };
  } catch (err) {
    console.log(err);
  }
}
