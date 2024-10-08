import { Icon } from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MyComponent from "./MyComponent";
import { useRef, forwardRef, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

const MyMap = forwardRef(function MyMap(
  {
    myPosition,
    handleMapClick,
    onClickMarker,
    placeData,
    initialMarker,
    setupInitialMarker,
    openModal,
    isSearching,
  },
  ref
) {
  const [markerIsClicked, setMarkerIsClicked] = useState(false);
  const [popupIsOpen, setPopupIsOpen] = useState(false);

  const markerRefs = useRef({});
  const openPopupRef = useRef(null);

  const closePopup = () => {
    if (openPopupRef.current) {
      openPopupRef.current.closePopup(); // Close the currently open popup
      openPopupRef.current = null; // Reset the reference
    }
  };

  const customIcon = new Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/128/2776/2776067.png",
    iconSize: [38, 38],
  });

  return (
    <>
      <MapContainer
        ref={ref}
        center={myPosition}
        zoom={13}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {initialMarker && <Marker position={initialMarker} icon={customIcon} />}
        {placeData.length > 0 &&
          placeData.map((currObj) => {
            if (currObj.formSubmitted) {
              return (
                <Marker
                  key={currObj.id}
                  ref={(el) => (markerRefs.current[currObj.id] = el)}
                  position={currObj.marker}
                  icon={customIcon}
                  eventHandlers={{
                    click: (e) => {
                      if (isSearching && popupIsOpen) {
                        setMarkerIsClicked(false);
                        setPopupIsOpen(false);
                        // e.target.closePopup();
                        return;
                      }

                      onClickMarker(currObj.marker);
                      setMarkerIsClicked(true);
                      setPopupIsOpen(true);
                      e.target.openPopup();
                    },
                    mouseover: (e) => {
                      if (markerIsClicked) {
                        setMarkerIsClicked(false);
                      }
                      e.target.openPopup();
                    },
                    mouseout: (e) => {
                      if (markerIsClicked) return;
                      if (!markerIsClicked && !popupIsOpen) {
                        e.target.closePopup();
                      }
                    },
                  }}
                >
                  <Popup>
                    <div className="popup_grid">
                      {currObj.images.map((image) => {
                        return (
                          <LazyLoadImage
                            key={image.file.name}
                            src={URL.createObjectURL(image.file)}
                            className="popup_picture"
                          />
                        );
                      })}
                    </div>
                    <div className="popup_text">
                      <p>
                        <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                          {currObj.place}
                        </span>{" "}
                        <br />
                        {currObj.date}
                      </p>
                      <p>
                        View{" "}
                        <span onClick={() => openModal(currObj)}>
                          all pictures
                        </span>
                      </p>
                    </div>
                  </Popup>

                  {currObj.place && currObj.date && (
                    <Popup
                      initial={{ opacity: 0, y: "-100px" }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="popup_grid">
                        {currObj.images.map((image) => {
                          return (
                            <LazyLoadImage
                              key={image.file.name}
                              src={URL.createObjectURL(image.file)}
                              className="popup_picture"
                            />
                          );
                        })}
                      </div>
                      <div className="popup_text">
                        <p>
                          <span
                            style={{ fontSize: "16px", fontWeight: "bold" }}
                          >
                            {currObj.place}
                          </span>{" "}
                          <br />
                          {currObj.date}
                        </p>
                        <p>
                          View{" "}
                          <span onClick={() => openModal(currObj)}>
                            all pictures
                          </span>
                        </p>
                      </div>
                    </Popup>
                  )}
                </Marker>
              );
            }
          })}
        <Marker
          position={myPosition}
          icon={customIcon}
          // ref={markerRef}
          eventHandlers={{
            click: () => {
              onClickMarker(myPosition);
            },
          }}
        >
          <Popup>
            You are here.
            <br /> This is your address.
          </Popup>
        </Marker>
        <MyComponent
          handleMapClick={handleMapClick}
          onClickMarker={onClickMarker}
          setupInitialMarker={setupInitialMarker}
        />
      </MapContainer>
    </>
  );
});

export default MyMap;
