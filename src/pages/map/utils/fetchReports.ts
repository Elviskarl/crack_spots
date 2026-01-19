import type { Report } from "../types/index";

export async function fetchReports(param: string): Promise<Report[]> {
  try {
    const request = new Request(param, {
      method: "GET",
    });
    const response = await fetch(request, {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error(`Error fetching reports: ${response.statusText}`);
    }
    const data: { message: string; data: Report[] } = await response.json();
    return data["data"];
  } catch (err) {
    console.error(err);
    return [];
  }
}
