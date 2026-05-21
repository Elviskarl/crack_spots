import { FetchError } from "../../../components/error/FetchError";
import type { FetchBackendResponse } from "../types/index";

export async function fetchReports(param: string) {
  const fetchController = new AbortController();
  let timer: NodeJS.Timeout | null = null;
  try {
    const { signal } = fetchController;
    const request = new Request(param, {
      method: "GET",
      signal,
    });

    timer = setTimeout(() => {
      fetchController.abort();
    }, 60000);

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
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new FetchError(
        "Server took too long to respond. Please refresh the page.",
      );
    }
    console.error(err);
    throw err;
  } finally {
    if (timer) clearTimeout(timer);
  }
}
