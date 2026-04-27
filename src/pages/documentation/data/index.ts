export const serverResponseInterface = `interface ApiResponse {
    success: boolean;
    data: Report[];
}`;
export const reportInterface = `interface Report {
  _id: string;
    user: string; // "community"
    severity: "high" | "medium" | "low";
    location: GeoPoint;
    cloudinary_url: string;
    dateTaken: string;
    issueId: string;
    createdAt: Date;
    status: "open" | "resolved";
    resolution?: {
      resolvedBy: string; // community
      resolvedAt: Date;
      dateTaken: string;
      imageUrl: string;
      coordinates: number[]; // [longitude, latitude]
      note: string;
    };

interface GeoPoint {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
    category?: string; 
    address?: {
    road?: string;
    city?: string;
    state?: string;
    neighbourhood?: string;
    };
}`;
export const formDataInterface = `file:File

interface CoordinateData {
  GPSLatitude: number;
  GPSLongitude: number;
  GPSLatitudeRef: "N" | "S";
  GPSLongitudeRef: "E" | "W";
  DateTimeOriginal: string;
}
  
severity: "low" | "medium" | "high";`;

export const resolveFormDataInterface = `file:File

interface CoordinateData {
  GPSLatitude: number;
  GPSLongitude: number;
  GPSLatitudeRef: "N" | "S";
  GPSLongitudeRef: "E" | "W";
  DateTimeOriginal: string;
}

_id: string;
  
note: string;`;

export const postSampleCode = `const formData = new FormData();

const coordinates:CoordinateData = {
  GPSLatitude,
  GPSLongitude,
  GPSLatitudeRef,
  GPSLongitudeRef,
  DateTimeOriginal
}

formData.append("file", file);
formData.append(
  "coordinates",
  JSON.stringify(coordinates)
);

formData.append("severity", severityInput.value);

const results = await fetch(
  "https://crackspots-server.onrender.com/api/v1/reports",
  {
    method: "POST",
    body: formData,
  },
);
`;

export const errorSample = `res.status(400).json({
 success: false, message: error.message 
 });
`;
export const issueSampleCode = `const grouped = Object.
    groupBy(reports, (report) => report.issueId);

  const groupedArray = Object.entries(grouped).map(([issueId, reports]) => ({
    issueId,
    reports: reports ?? [],
  }));`;

export const resolveReportSample = `const formData = new FormData();

formData.append("file", fileCopy);

formData.append("coordinates", JSON.stringify(coordsCopy));

if (textAreaEl) {
  formData.append("note", textAreaEl.value);
}

formData.append("_id", _id);

const results = await fetch(
  "https://crackspots-server.onrender.com/api/v1/resolve",
  {
    method: "PATCH",
    body: formData,
  },
);`;
