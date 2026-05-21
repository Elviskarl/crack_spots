import { FetchError } from "../../../components/error/FetchError";
import type { ResolveIssuesResponse } from "../types";

export default async function resolveIssues(
  url: string,
  data: FormData,
  signal: AbortSignal,
) {
  try {
    const request = new Request(url, {
      method: "PATCH",
      body: data,
      signal,
    });

    const response = await fetch(request);
    if (!response.ok) {
      throw new FetchError(`Error resolving issue: ${response.statusText}`);
    }
    const result = (await response.json()) as ResolveIssuesResponse;
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
    console.error(error);
    throw error;
  }
}
