import { FetchError } from "../../../components/error/FetchError";
import type { FetchReportsResponse } from "../types/index";

export async function fetchReports(param: string, signal: AbortSignal) {
  const request = new Request(param, {
    method: "GET",
    signal,
  });

  const response = await fetch(request);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Something went wrong");
  }

  const serverData = (await response.json()) as FetchReportsResponse;

  if (!serverData.success) {
    throw new FetchError(serverData.message);
  }
  return serverData.data;
}
