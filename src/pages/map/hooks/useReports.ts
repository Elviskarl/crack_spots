import { useQuery } from "@tanstack/react-query";
import { fetchReports } from "../utils/fetchReports";

export default function useReports() {
  return useQuery({
    queryKey: ["reports"],
    queryFn: ({ signal }) =>
      fetchReports(
        "https://crackspots-server.onrender.com/api/v1/reports",
        signal,
      ),
    staleTime: Infinity,
  });
}
