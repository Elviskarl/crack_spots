import { FetchError } from "../../../components/error/FetchError";
import type { FetchBackendResponse } from "../types/index";

export async function fetchReports(param: string) {
  try {
    const request = new Request(param, {
      method: "GET",
    });

    const response = await fetch(request);
    if (!response.ok) {
      throw new FetchError(`Error fetching reports: ${response.statusText}`);
    }
    const serverData = (await response.json()) as FetchBackendResponse;
    if ("data" in serverData) {
      return serverData.data;
    }
    throw new FetchError(serverData.message);
  } catch (err) {
    console.error(err);
    throw err;
  }
}
