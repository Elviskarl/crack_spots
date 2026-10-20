// queryClient.ts
import { QueryCache, QueryClient } from "@tanstack/react-query";
import type { NotificationType } from "./pages/map/types";

let notify: (notification: NotificationType) => void = () => {};

export function setQueryNotificationHandler(handler: typeof notify) {
  notify = handler;
}

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      if (query.queryKey[0] !== "reports") return;

      notify({
        type: "Error",
        message: error.message,
      });
    },
    onSuccess: (_data, query) => {
      if (query.queryKey[0] !== "reports") return;

      notify({
        type: "Success",
        message: "Reports fetched successfully",
      });
    },
  }),
});
