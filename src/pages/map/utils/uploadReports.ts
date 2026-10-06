import { FetchError } from "../../../components/error/FetchError";
import type { ServerResponse } from "../types";

export async function uploadReports(param: string, data: FormData) {
  try {
    const request = new Request(param, {
      method: "POST",
      body: data,
    });

    const response = await fetch(request);

    const result = (await response.json()) as ServerResponse;

    if (!result.success) {
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
