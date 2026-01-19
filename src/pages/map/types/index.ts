export interface Report {
  _id: string;
  user: string;
  severity: "low" | "medium" | "high"; // extend if needed
  location: GeoPoint;

  cloudinary_public_id: string;
  cloudinary_url: string;

  dateTaken: string; // human-readable date
  createdAt: string; // ISO string
  updatedAt: string; // ISO string

  __v: number;
}
export interface GeoPoint {
  type: "Point";
  coordinates: [number, number]; // [longitude, latitude]
}
export interface CoordinateData {
  GPSLatitude: number;
  GPSLongitude: number;
  GPSLatitudeRef: "N" | "S";
  GPSLongitudeRef: "E" | "W";
  DateTimeOriginal: string;
}