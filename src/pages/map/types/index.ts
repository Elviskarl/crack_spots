import type { Dispatch, RefObject, SetStateAction } from "react";

interface BaseReport {
  _id: string;
  user: string;
  severity: "high" | "medium" | "low";
  location: GeoPoint;
  cloudinary_url: string;
  dateTaken: string;
  issueId: string;
  createdAt: Date;
}
interface unResolvedReport extends BaseReport {
  status: "open";
}
interface ResolvedReport extends BaseReport {
  status: "resolved";

  resolution: {
    resolvedBy: string; // community
    resolvedAt: Date;
    dateTaken: string;
    imageUrl: string;
    coordinates: number[]; // [longitude, latitude]
    note: string;
    quality: "temporary" | "permanent";
  };
}

export type Report = unResolvedReport | ResolvedReport;
export interface GeoPoint {
  type: "Point";
  coordinates: [number, number]; // [longitude, latitude]
  category?: string; // optional category field for future use
  address?: {
    road?: string;
    city?: string;
    state?: string;
    neighbourhood?: string;
  };
}
export interface CoordinateData {
  GPSLatitude: number;
  GPSLongitude: number;
  GPSLatitudeRef: "N" | "S";
  GPSLongitudeRef: "E" | "W";
  DateTimeOriginal: string;
}

export interface NotificationType {
  type: "Error" | "Warning" | "Success" | "Info";
  code?: string;
  message: string;
}

export interface ListItemsProps {
  imageUrl: string;
  textContent: string;
  Component: React.ComponentType<ListItemOptional>;
  requiresLoading?: boolean;
  collapsed?: boolean;
  setCollapsed?: Dispatch<SetStateAction<boolean>>;
}
export interface ListItemOptional {
  setCollapsed?: Dispatch<SetStateAction<boolean>>;
  isResolving?: boolean;
  interestedReport?: Report | null;
  setInterestedReport?: Dispatch<SetStateAction<Report | null>>;
}

export interface SearchSuggestionsProps {
  suggestions: string[];
  setSearchTerm: Dispatch<SetStateAction<string>>;
  setMatchingReport: Dispatch<SetStateAction<Report[] | null>>;
  setInterestedReport: Dispatch<SetStateAction<Report | null>> | undefined;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  debouncedSearchTerm: string;
  isOpen: boolean;
  func: (term: string) => Report[];
  searchedTerm: RefObject<string>;
  resetPreview?: () => void;
}

export interface LocationGroup {
  id: string;
  issues: {
    issueId: string;
    reports: Report[];
  }[];
  issueCount: number;
  allResolved: boolean;
}

export interface downloadKeys {
  _id: string;
  user: string;
  severity: Report["severity"];
  type: string;
  longitude: number;
  latitude: number;
  road: string | null;
  neighbourhood: string | null;
  state: string | null;
  issueId: string;
  report_image_URL: Report["cloudinary_url"];
  dateTaken: string;
  createdAt: Date;
  status: Report["status"];
  resolution_quality: NonNullable<
    ResolvedReport["resolution"]["quality"]
  > | null;
  resolution_date: string | null;
  resolution_longitude: number | null;
  resolution_latitude: number | null;
  resolution_image_URL: string | null;
  resolution_note: string | null;
}

interface SuccessServerResponse {
  success: true;
  message: string;
}
interface ErrorServerResponse {
  success: false;
  message: string;
}
interface FetchSuccessResponse {
  success: true;
  data: Report[];
}
interface FetchErrorResponse {
  success: false;
  message: string;
}

// export interface UploadResponse extends BaseResponse {
//   message: string;
// }

export interface ReportCoordinates {
  lat: number;
  lng: number;
}

export type ServerResponse = SuccessServerResponse | ErrorServerResponse;
export type FetchReportsResponse = FetchSuccessResponse | FetchErrorResponse;
