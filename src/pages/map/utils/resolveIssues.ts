import { FetchError } from "../../../components/error/FetchError";
import type { serverResponse } from "../types";

export default async function resolveIssues(url: string, data: FormData) {
  const request = new Request(url, {
    method: "PATCH",
    body: data,
  });
  const response = await fetch(request);
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new FetchError(
      errorData?.message || `Request failed with ${response.status}`,
    );
  }
  const result = (await response.json()) as serverResponse;
  return result;
}
