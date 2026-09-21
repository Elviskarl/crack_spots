import "./styles/loading.css";
import { ClipLoader, PropagateLoader, ScaleLoader } from "react-spinners";

interface LoadingScreenProp {
  category: "report" | "image" | "notification";
  condition: boolean;
}
export default function LoadingScreen({
  category,
  condition,
}: LoadingScreenProp) {
  return (
    <div
      className={`loading-screen loading-screen-${category} ${condition ? "active" : ""}`}
    >
      {category === "notification" ? (
        <ClipLoader
          loading={condition}
          aria-label="Loading Spinner"
          color="green"
        />
      ) : category === "image" ? (
        <ScaleLoader
          loading={condition}
          aria-label="Loading Spinner"
          color="var(--tertiary-shade)"
        />
      ) : (
        <PropagateLoader
          loading={condition}
          aria-label="Loading Spinner"
          color="#32cd32"
        />
      )}
    </div>
  );
}
