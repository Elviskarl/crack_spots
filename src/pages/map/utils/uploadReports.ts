import { FetchError } from "../../../components/error/FetchError";
import type { UploadResponse } from "../types";

export async function uploadReports(param: string, data: FormData) {
  try {
    const request = new Request(param, {
      method: "POST",
      body: data,
    });

    const response = await fetch(request);
    if (!response.ok) {
      throw new FetchError(`Error uploading report: ${response.statusText}`);
    }
    const result = (await response.json()) as UploadResponse;
    if (result.success) {
      return result;
    }
    throw new FetchError(result.message);
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new FetchError(
        "Server took too long to respond. Please refresh the page.",
      );
    }
    console.error("Error uploading report:", error);
    throw error;
  }
}
