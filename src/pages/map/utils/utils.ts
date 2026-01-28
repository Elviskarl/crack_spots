import * as ExifReader from "exifreader";
import type { CoordinateData } from "../types";
import { CustomError } from "../../../components/error/CustomError";

export async function readFile(
  param: File,
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
      throw new CustomError(
        "EXIF_READ_FAILED",
        "The selected file is not Geo-tagged. Please select another image.",
      );
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
    if (err instanceof CustomError) {
      throw err;
    }
    console.error(err);
  }
}

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export function validateFile(file: File) {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new CustomError(
      "INVALID_FILE_TYPE",
      `Please upload a JPG, PNG, or WEBP image. Received: ${file.type}`,
    );
  }
}
