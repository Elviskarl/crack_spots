import { useMemo } from "react";
import * as turf from "@turf/turf";
import type { Report } from "../types";

type Issue = {
  issueId: string;
  reports: Report[];
};

type LocationGroup = {
  id: string;
  issues: Issue[];
};

export default function useLocationGroups(issues: Issue[]) {
  return useMemo(() => {
    const groups: LocationGroup[] = [];
    const RADIUS = 10;

    for (const issue of issues) {
      const latest = issue.reports[0];

      if (!latest?.location?.coordinates) continue;
      if (!latest.location.address?.road) continue;

      const roadName = latest.location.address?.road.trim().toLowerCase();
      const [lng, lat] = latest.location.coordinates;
      const point = turf.point([lng, lat]);

      let matchedGroup: LocationGroup | null = null;

      for (const group of groups) {
        const latestIssueInGroup = group.issues[0].reports[0];
        const [latestLng, latestLat] = latestIssueInGroup.location.coordinates;
        const groupRoadName = latestIssueInGroup.location.address?.road
          ?.trim()
          .toLowerCase();

        const latestIssueInGroupPoint = turf.point([latestLng, latestLat]);

        const distance = turf.distance(point, latestIssueInGroupPoint, {
          units: "meters",
        });

        if (roadName !== groupRoadName) continue;

        if (distance <= RADIUS) {
          matchedGroup = group;
          break;
        }
      }

      if (matchedGroup) {
        matchedGroup.issues.push(issue);
      } else {
        groups.push({
          id: `loc-${groups.length}`,
          issues: [issue],
        });
      }
    }

    return groups;
  }, [issues]);
}
