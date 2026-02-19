import { FetchError } from "../../../components/error/FetchError";
import type { serverResponse } from "../types";

export async function uploadReports(
  param: string,
  data: FormData,
): Promise<serverResponse> {
  try {
    const request = new Request(param, {
      method: "POST",
      body: data,
    });
    const response = await fetch(request);
    if (!response.ok) {
      throw new FetchError(`Error uploading report: ${response.statusText}`);
    }
    const result = (await response.json()) as serverResponse;
    return result;
  } catch (error) {
    console.error("Error uploading report:", error);
    throw error;
  }
}
