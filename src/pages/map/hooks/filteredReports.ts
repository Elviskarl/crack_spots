import { useMemo } from "react";
import useReports from "./useReports";
import useMapContext from "./getMapContext";
import useReportContext from "./getReportsContext";
import { booleanPointInPolygon, point } from "@turf/turf";

export default function useFilteredReports() {
  const { data: reports = [] } = useReports();
  const { nairobiSubCountyShapefile } = useMapContext();
  const { filterValues } = useReportContext();

  const cleanShapeFile = nairobiSubCountyShapefile.current;

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      if (filterValues.yearTaken && Number.isInteger(filterValues.yearTaken)) {
        const date = new Date(report.dateTaken);
        if (isNaN(date.getTime())) return false;
        if (date.getUTCFullYear() !== filterValues.yearTaken) return false;
      }
      if (filterValues.severity && report.severity !== filterValues.severity)
        return false;
      if (
        filterValues.reportStatus &&
        report.status !== filterValues.reportStatus
      )
        return false;
      if (
        report.status === "resolved" &&
        filterValues.resolutionQuality &&
        report.resolution.quality !== filterValues.resolutionQuality
      )
        return false;
      if (filterValues.location) {
        const feature = cleanShapeFile?.features.find(
          (f) => f.properties?.subcounty === filterValues.location,
        );
        if (!feature) return false;
        const reportPoint = point([
          report.location.coordinates[0],
          report.location.coordinates[1],
        ]);
        if (!booleanPointInPolygon(reportPoint, feature)) return false;
      }
      if (filterValues.streetName) {
        const road = report.location.address?.road?.toLowerCase();
        if (!road) return false;
        if (!road.includes(filterValues.streetName.toLowerCase())) return false;
      }
      return true;
    });
  }, [filterValues, reports, cleanShapeFile]);
  
  return filteredReports;
}
