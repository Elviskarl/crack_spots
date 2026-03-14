import { GeoJSON, useMap } from "react-leaflet";
import { useContext, useEffect } from "react";
import { geoJson } from "leaflet";
import { MapContext } from "../../../../../context/createMapContext";

export default function DisplayShapefile() {
  const map = useMap();
  const {
    setIsNotInNairobi,
    nairobiSubCountyShapefile: shapefile,
    isNotInNairobi,
  } = useContext(MapContext)!;

  useEffect(() => {
    if (!isNotInNairobi) return;
    if (!shapefile.current) return;

    const previousCenter = map.getCenter();
    const previousZoom = map.getZoom();

    const layer = geoJson(shapefile.current);
    const bounds = layer.getBounds();

    map.fitBounds(bounds);

    const timer = setTimeout(() => {
      setIsNotInNairobi(false);
      map.flyTo(previousCenter, previousZoom, {
        duration: 1.2,
      });
    }, 2000);
    return () => clearTimeout(timer);
  }, [isNotInNairobi, setIsNotInNairobi, shapefile, map]);
  const styleOptions = {
    color: "red",
    weight: 3,
    fillOpacity: 0,
    opacity: 1,
  };
  return (
    shapefile.current && (
      <GeoJSON data={shapefile.current} style={styleOptions} />
    )
  );
}
