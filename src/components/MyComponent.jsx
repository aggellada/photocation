import { useMapEvents } from "react-leaflet";

export default function MapClickHandler({
  handleMapClick,
  onClickMarker,
  setupInitialMarker,
}) {
  useMapEvents({
    click(e) {
      handleMapClick(e.latlng);
      onClickMarker(e.latlng);
      setupInitialMarker(e.latlng);
    },
  });
  return null;
}
