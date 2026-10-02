import { useContext } from "react";
import { MapContext } from "../../../context/createMapContext";

export default function useMapContext() {
  const mapContext = useContext(MapContext);
  if (!mapContext) {
    throw new Error("useMapContext must be used within a MapContextProvider");
  }
  return mapContext;
}
