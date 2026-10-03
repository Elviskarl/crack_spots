import { useContext } from "react";
import { ReportContext } from "../../../context/createReportContext";

export default function useReportContext() {
  const reportContext = useContext(ReportContext);
  if (!reportContext) {
    throw new Error(
      "useReportContext must be used within a ReportContextProvider",
    );
  }
  return reportContext;
}
