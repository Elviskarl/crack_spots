import { FetchError } from "../../../components/error/FetchError";
import type { FetchReportsResponse } from "../types/index";

export async function fetchReports(param: string, signal: AbortSignal) {
  const request = new Request(param, {
    method: "GET",
    signal,
  });

  const response = await fetch(request);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  const serverData = (await response.json()) as FetchReportsResponse;

  if (!serverData.success) {
    throw new FetchError(serverData.message);
  }
  return serverData.data;
}
