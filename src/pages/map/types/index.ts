import type { Dispatch, SetStateAction } from "react";

export interface Report {
  _id: string;
  user: string;
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
}
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

export interface serverResponse {
  success: boolean;
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
