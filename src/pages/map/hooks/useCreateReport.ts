// hooks
import { useMutation, useQueryClient } from "@tanstack/react-query";
// Helper Fn
import { uploadReports } from "../utils/uploadReports";
// Types
import type { NotificationType, Report } from "../types";

export default function useCreateReport(
  onNotified: (notification: NotificationType) => void,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ url, formData }: { url: string; formData: FormData }) =>
      uploadReports(url, formData),
    onSuccess: (data) => {
      onNotified({
        type: "Success",
        message: `Upload successful: ${data.message}.`,
      });
      queryClient.setQueryData<Report[]>(["reports"], (cachedReports) => {
        if (!cachedReports) return [data.report];

        return [...cachedReports, data.report];
      });
    },
  });
}
