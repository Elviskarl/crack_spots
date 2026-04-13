import { FetchError } from "../../../components/error/FetchError";
import type { Report } from "../types/index";

export async function fetchReports(param: string): Promise<Report[]> {
  try {
    const request = new Request(param, {
      method: "GET",
    });
    const response = await fetch(request);
    if (!response.ok) {
      throw new FetchError(`Error fetching reports: ${response.statusText}`);
    }
    const { data, success }: { success: boolean; data: Report[] } =
      await response.json();
    if (!success) {
      throw new FetchError("Failed to fetch reports");
    }
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
