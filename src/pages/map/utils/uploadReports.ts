import { FetchError } from "../../../components/error/FetchError";
import type { UploadResponse } from "../types";

export async function uploadReports(param: string, data: FormData) {
  try {
    const request = new Request(param, {
      method: "POST",
      body: data,
    });

    const response = await fetch(request);

    const result = (await response.json()) as UploadResponse;

    if (!response.ok && "error" in result) {
      throw new FetchError(result.error);
    }
    if ("success" in result && !result.success) {
      throw new FetchError(result.message);
    }
    return result;
  } catch (error) {
    // if (error instanceof DOMException && error.name === "AbortError") {
    //   throw new FetchError(
    //     "Server took too long to respond. Please refresh the page.",
    //   );
    // }
    console.error("Error uploading report:", error);
    throw error;
  }
}
