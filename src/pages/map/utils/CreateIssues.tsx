import { useMemo } from "react";
import type { Report } from "../types";

export default function CreateIssues(param: Report[]) {
  const issues = useMemo(() => {
    const grouped = Object.groupBy(param, (report) => report.issueId);

    return Object.entries(grouped).map(([issueId, reports]) => ({
      issueId,
      reports: reports ?? [],
    }));
  }, [param]);
  return issues;
}
