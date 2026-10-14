import type { downloadKeys, Report } from "../types";
import { createRowData } from "./utils";

export default function handleDownload(
  filteredReports: Report[],
  cachedResults: Report[],
) {
  if (!filteredReports.length) {
    throw new Error(
      "The selected filters did not return any reports. Adjust your filters and try again.",
    );
  }

  const anchorElement = document.createElement("a");

  try {
    anchorElement.classList.add("download-link");
    anchorElement.hidden = true;

    const uniqueKeys = new Set<keyof downloadKeys>();

    const groupedReports = new Map<string, Report[]>();

    cachedResults.forEach((report) => {
      const group = groupedReports.get(report.issueId);
      if (group) {
        group.push(report);
      } else {
        groupedReports.set(report.issueId, [report]);
      }
    });

    const resolvedReport = cachedResults.find(
      (report) => report.status === "resolved",
    );

    if (!resolvedReport) {
      throw new Error("No resolved reports found to determine CSV structure.");
    }

    const reportKeyMap: Partial<Record<keyof Report, keyof downloadKeys>> = {
      _id: "_id",
      user: "user",
      severity: "severity",
      issueId: "issueId",
      dateTaken: "dateTaken",
      createdAt: "createdAt",
      status: "status",
      cloudinary_url: "report_image_URL",
    };

    Object.keys(resolvedReport).forEach((key) => {
      if (key === "location") {
        uniqueKeys.add("type");
        if (
          "coordinates" in resolvedReport.location &&
          Array.isArray(resolvedReport.location.coordinates)
        ) {
          uniqueKeys.add("longitude");
          uniqueKeys.add("latitude");
        }
        if ("address" in resolvedReport.location) {
          uniqueKeys.add("road");
          uniqueKeys.add("neighbourhood");
          uniqueKeys.add("state");
        }
      } else if (key === "cloudinary_url") {
        uniqueKeys.add("report_image_URL");
      } else if (key === "resolution") {
        uniqueKeys.add("resolution_quality" as keyof downloadKeys);
        uniqueKeys.add("resolution_date" as keyof downloadKeys);
        if (
          "coordinates" in resolvedReport.resolution &&
          Array.isArray(resolvedReport.resolution.coordinates)
        ) {
          uniqueKeys.add("resolution_longitude" as keyof downloadKeys);
          uniqueKeys.add("resolution_latitude" as keyof downloadKeys);
        }
        uniqueKeys.add("resolution_image_URL" as keyof downloadKeys);
        uniqueKeys.add("resolution_note" as keyof downloadKeys);
      } else {
        const mappedKey = reportKeyMap[key as keyof Report];

        if (mappedKey) {
          uniqueKeys.add(mappedKey);
        }
      }
    });

    const values = [];
    values.unshift(Array.from(uniqueKeys));

    const resolvedIssueIds = new Set<string>();

    filteredReports.forEach((report) => {
      if (report.status === "resolved") {
        const { issueId } = report;

        if (resolvedIssueIds.has(issueId)) return;
        const similarReportIssue = groupedReports.get(issueId);

        if (!similarReportIssue || !similarReportIssue.length) return;

        similarReportIssue.forEach((report) => {
          const row = createRowData(report);
          values.push(Object.values(row));
          return;
        });
        resolvedIssueIds.add(issueId);
      } else {
        const row = createRowData(report);
        row.resolution_quality = null;
        row.resolution_date = null;
        row.resolution_longitude = null;
        row.resolution_latitude = null;
        row.resolution_image_URL = null;
        row.resolution_note = null;
        values.push(Object.values(row));
      }
    });

    let csvContent = "";
    values.forEach((row) => {
      csvContent += row
        .map((val) => {
          const escaped = String(val ?? "").replace(/"/g, '""');

          return `"${escaped}"`;
        })
        .join(",")
        .concat("\n");
    });

    const data = new File([csvContent], "filtered-reports.csv", {
      type: "text/csv;charset=utf-8;",
    });
    anchorElement.href = URL.createObjectURL(data);
    anchorElement.download = "filtered-reports.csv";
    anchorElement.click();
  } finally {
    setTimeout(() => {
      URL.revokeObjectURL(anchorElement.href);
    }, 1000);
    anchorElement.remove();
  }
}
