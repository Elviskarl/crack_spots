import { useContext } from "react";
import { ReportContext } from "../context/createReportContext";
import "./styles/loading.css";
import { ClipLoader, ScaleLoader } from "react-spinners";

interface LoadingScreenProp {
  category: "report" | "image" | "notification";
}
export default function LoadingScreen({ category }: LoadingScreenProp) {
  const { isLoading } = useContext(ReportContext)!;
  return (
    <div
      className={`loading-screen loading-screen-${category} ${isLoading ? "active" : ""}`}
    >
      {category === "notification" ? (
        <ClipLoader
          loading={isLoading}
          aria-label="Loading Spinner"
          color="green"
        />
      ) : category === "image" ? (
        <ScaleLoader
          aria-label="Loading Spinner"
          color="var(--tertiary-shade)"
        />
      ) : (
        ""
      )}
    </div>
  );
}
