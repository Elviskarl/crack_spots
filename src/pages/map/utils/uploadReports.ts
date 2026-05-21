import { FetchError } from "../../../components/error/FetchError";
import type { UploadResponse } from "../types";

export async function uploadReports(param: string, data: FormData) {
  let timer: NodeJS.Timeout | null = null;
  try {
    const fetchController = new AbortController();
    const { signal } = fetchController;

    const request = new Request(param, {
      method: "POST",
      body: data,
      signal,
    });

    timer = setTimeout(() => {
      fetchController.abort();
    }, 60000);

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
  } finally {
    if (timer) clearTimeout(timer);
  }
}
