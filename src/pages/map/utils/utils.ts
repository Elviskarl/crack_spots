import * as ExifReader from "exifreader";
import * as turf from "@turf/turf";
import type { CoordinateData } from "../types";
import { CustomError } from "../../../components/error/CustomError";
import type { FeatureCollection, MultiPolygon, Polygon } from "geojson";

export async function readFile(param: File): Promise<CoordinateData> {
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
    throw new CustomError("NO_EXIF_DATA", "Failed to read image metadata");
  }
}

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export function validateFile(file: File) {
  const fileType = file.type;
  const isValid = ALLOWED_MIME_TYPES.includes(file.type);
  return { isValid, fileType };
}

export async function loadBoundary(): Promise<
  FeatureCollection<Polygon | MultiPolygon>
> {
  // const res = await fetch("crack_spots/data/Nairobi_subCounty.json");
  const res = await fetch(
    `${import.meta.env.BASE_URL}data/Nairobi_subCounty.json`,
  );

  if (!res.ok) throw new Error(`Failed to load boundary: ${res.statusText}`);
  const data = (await res.json()) as FeatureCollection<Polygon | MultiPolygon>;
  return data;
}

function isInBoundingBox(
  param: FeatureCollection<Polygon | MultiPolygon>,
  lat: number,
  lon: number,
) {
  const bBox = turf.bbox(param);
  const [minLon, minLat, maxLon, maxLat] = bBox;
  return lon >= minLon && lon <= maxLon && lat >= minLat && lat <= maxLat;
}

export function isInNairobi(
  lat: number,
  lon: number,
  shapefile: FeatureCollection<Polygon | MultiPolygon>,
) {
  const isInBbox = isInBoundingBox(shapefile, lat, lon);
  if (!isInBbox) {
    return false;
  }
  const point = turf.point([lon, lat]);
  return shapefile.features.some((feature) =>
    turf.booleanPointInPolygon(point, feature),
  );
}

export function resolveData(
  reportCoordinates: {
    GPSLatitude: number;
    GPSLongitude: number;
    DateTimeOriginal: string;
  },
  resolutionCoordinates: CoordinateData,
) {
  try {
    const maxDistance = 30;
    const {
      GPSLatitude: reportLat,
      GPSLongitude: reportLon,
      DateTimeOriginal: reportDateTime,
    } = reportCoordinates;
    const {
      GPSLatitude: resolutionLat,
      GPSLongitude: resolutionLon,
      DateTimeOriginal: resolutionDateTime,
    } = resolutionCoordinates;

    const reportPoint = turf.point([reportLon, reportLat]);
    const resolutionPoint = turf.point([resolutionLon, resolutionLat]);
    const distance = turf.distance(reportPoint, resolutionPoint, {
      units: "meters",
    });
    console.log(distance);

    if (distance > maxDistance) {
      throw new CustomError(
        "LOCATION_MISMATCH",
        `The image coordinates are too far from the report coordinates. Distance: ${distance.toFixed(2)} meters.`,
      );
    }
    const reportDate = new Date(reportDateTime);
    const resolutionDate = new Date(resolutionDateTime);
    if (resolutionDate <= reportDate) {
      throw new CustomError(
        "TIME_MISMATCH",
        "The resolution image must be taken after the report was created.",
      );
    }
  } catch (err) {
    if (err instanceof CustomError) {
      throw err;
    }
    throw new Error(
      "Invalid Data: Unable to resolve report due to invalid coordinate data.",
    );
  }
}
