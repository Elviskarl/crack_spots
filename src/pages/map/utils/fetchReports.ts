import { FetchError } from "../../../components/error/FetchError";
import type { FetchReportsResponse } from "../types/index";

export async function fetchReports(param: string, signal: AbortSignal) {
  try {
    const request = new Request(param, {
      method: "GET",
      signal,
    });

    const response = await fetch(request);

    const serverData = (await response.json()) as FetchReportsResponse;
    if (serverData.success) {
      return serverData.data;
    }
    throw new FetchError(serverData.message);
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      console.error(err);
      throw err;
    }
    console.error(err);
    throw err;
  }
}
