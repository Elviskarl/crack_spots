import { FetchError } from "../../../components/error/FetchError";
import type { ResolveIssuesResponse } from "../types";

export default async function resolveIssues(url: string, data: FormData) {
  let timer: NodeJS.Timeout | null = null;
  try {
    const fetchController = new AbortController();

    const { signal } = fetchController;

    const request = new Request(url, {
      method: "PATCH",
      body: data,
      signal,
    });

    timer = setTimeout(() => {
      fetchController.abort();
    }, 60000);

    const response = await fetch(request);
    if (!response.ok) {
      throw new FetchError(`Error resolving issue: ${response.statusText}`);
    }
    const result = (await response.json()) as ResolveIssuesResponse;
    if(result.success){
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
  } finally {
    if (timer) clearTimeout(timer);
  }
}
