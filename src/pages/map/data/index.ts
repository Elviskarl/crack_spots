import type { FilterValues } from "../types";

export const severityValues = [
  { label: "minor", value: "low" },
  { label: "moderate", value: "medium" },
  { label: "extensive", value: "high" },
];

export const defaultFilterValues: FilterValues = {
  yearTaken: "",
  location: "",
  resolutionQuality: "",
  reportStatus: "",
  severity: "",
  streetName: "",
};
