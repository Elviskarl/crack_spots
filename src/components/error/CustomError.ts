export type ErrorCode =
  | "INVALID_FILE_TYPE"
  | "NO_EXIF_DATA"
  | "NO_GPS_DATA"
  | "EXIF_READ_FAILED";

export class CustomError extends Error {
  code: ErrorCode;

  constructor(code: ErrorCode, message: string) {
    super(message);
    this.code = code;
  }
}
