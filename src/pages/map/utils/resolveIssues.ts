import { FetchError } from "../../../components/error/FetchError";
import type { ResolveIssuesResponse } from "../types";

export default async function resolveIssues(url: string, data: FormData) {
  try {
    const request = new Request(url, {
      method: "PATCH",
      body: data,
    });

    const response = await fetch(request);
    const result = (await response.json()) as ResolveIssuesResponse;
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
    console.error(error);
    throw error;
  }
}
