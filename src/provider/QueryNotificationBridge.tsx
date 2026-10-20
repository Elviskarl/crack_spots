import { useEffect } from "react";
import useReportContext from "../pages/map/hooks/getReportsContext";
import { setQueryNotificationHandler } from "../queryClient";

export default function QueryNotificationBridge() {
  const { setNotification } = useReportContext();

  useEffect(() => {
    setQueryNotificationHandler(setNotification);

    return () => {
      setQueryNotificationHandler(() => {});
    };
  }, [setNotification]);

  return null;
}
