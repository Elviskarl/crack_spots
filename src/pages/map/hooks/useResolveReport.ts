// hooks
import { useMutation, useQueryClient } from "@tanstack/react-query";
// Helper Fn
import resolveIssues from "../utils/resolveIssues";
// types
import type { NotificationType, Report } from "../types";

export default function useResolveReport(
  onNotified: (notification: NotificationType) => void,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ url, formData }: { url: string; formData: FormData }) =>
      resolveIssues(url, formData),
    onSuccess: (data) => {
      onNotified({
        type: "Success",
        message: `Upload successful: ${data.message}.`,
      });
      queryClient.setQueryData<Report[]>(["reports"], (cachedReports) => {
        if (!cachedReports) return;
        return cachedReports.map((report) =>
          report._id === data.report._id ? data.report : report,
        );
      });
    },
  });
}
