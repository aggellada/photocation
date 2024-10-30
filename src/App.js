import "./App.css";
import List from "./components/List";
import Modal from "./components/Modal";
import MyMap from "./components/MyMap";

import { useState, useEffect, useRef } from "react";

function App() {
  // ------------ MAP COORDINATE STATES -------------------
  const [myPosition, setMyPosition] = useState(null);
  const [mapIsClicked, setMapIsClicked] = useState(false);
  const [initialMarker, setInitialMarker] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  // ----------------- DATA STATES ------------------------
  const [inputId, setInputId] = useState(null);
  const [placeData, setPlaceData] = useState([]);

  // ------------------ MODAL STATES ------------------------
  const [modalData, setModalData] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // --------------------- REFS ------------------------------
  const mapRef = useRef();
  const modalRef = useRef();

  // ---------------- VARIABLE DECLARATIONS ------------------
  const currentInput = placeData.find((curr) => curr.id === inputId);

  // ------------------- GET USER'S CURRENT LOCATION  ---------------------
  useEffect(() => {
    try {
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        setMyPosition([latitude, longitude]);
      });
    } catch (err) {
      throw err;
    }
  }, []);

  useEffect(() => {
    setupInitialMarker(null);
  }, [mapIsClicked]);

  // ------------------- GET SEARCH LOCATION  ---------------------
  const searchLocation = async (city) => {
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://api.api-ninjas.com/v1/geocoding?city=${city}&country=`,
        {
          method: "GET",
          headers: {
            "X-Api-Key": "bh4mrt1FXH/dyBJBvglY8g==JgI9bT54n0F7cIuL",
          },
        }
      );
      const data = await response.json();
      const { latitude, longitude } = data[0];

      const map = mapRef.current;
      if (!map) return;
      map.flyTo([latitude, longitude], 13);

      setIsSearching(false);
    } catch (err) {
      throw err;
    }
  };

  // console.log(searchLocationCoords);
  console.log(isSearching);

  // --------------------- MODAL FUNCTIONALITIES ------------------------
  useEffect(() => {
    if (showModal) {
      modalRef.current.showModal();
    }

    if (showModal && modalData.id) {
      const updatedModalData = placeData.find(
        (place) => place.id === modalData.id
      );
      setModalData(updatedModalData);
    }
  }, [showModal, placeData]);

  // ------------------------- DELETE -------------------------------
  const handleDelete = (selectedPlaceId) => {
    setPlaceData((prev) => {
      return prev.filter((currObj) => currObj.id !== selectedPlaceId);
    });
  };

  const handleDeleteInput = (selectedPlaceId) => {
    setPlaceData((prev) => {
      return prev.filter((currObj) => currObj.id !== selectedPlaceId);
    });

    setMapIsClicked(false);
  };

  // ------------------------- MAP CLICKS -----------------------------
  const handleMapClick = (coords) => {
    if (mapIsClicked) return;

    setMapIsClicked(true);

    const markerId = Math.random();
    setPlaceData((prev) => {
      const placeObject = {
        id: markerId,
        marker: coords,
        formSubmitted: false,
      };
      return [placeObject, ...prev];
    });

    setInputId(markerId);
    setInitialMarker(null);
  };

  const onClickMarker = (markerPosition) => {
    const map = mapRef.current;
    if (!map) return;
    map.flyTo(markerPosition, 13);
  };

  const setupInitialMarker = (initialCoordinates) => {
    if (mapIsClicked) return;
    setInitialMarker(initialCoordinates);
  };

  // -------------------------- FORM AND DATA SUBMISSION ------------------------
  const handleSubmit = (e, updatedData) => {
    e.preventDefault();

    setPlaceData((prevArr) => {
      return prevArr.map((obj) => {
        if (obj.id !== updatedData.id) return obj;
        return updatedData;
      });
    });

    setMapIsClicked(false);
  };

  const addMorePhotos = (currData, im) => {
    setPlaceData((prev) => {
      return prev.map((currPlace) => {
        if (currPlace.id !== currData.id) return currPlace;
        const newImages = [...currPlace.images, ...im];
        return { ...currPlace, images: newImages };
      });
    });
  };

  const deleteCurrentPhoto = (modalData, image) => {
    setPlaceData((prev) => {
      return prev.map((currPlace) => {
        if (currPlace.id !== modalData.id) return currPlace;
        const filteredImages = currPlace.images.filter(
          (objectImage) => objectImage !== image
        );
        return { ...currPlace, images: filteredImages };
      });
    });
  };

  // ------------------- OPEN AND CLOSE MODAL ------------------------
  const openModal = (currObj) => {
    setModalData(currObj);
    setShowModal(true);
  };

  const testModalData = (currentPhotoId, inputIsActive) => {
    if (inputIsActive) return;

    setModalData((prev) => {
      const editImagesTrue = prev.images.map((image) => {
        if (image.photoId !== currentPhotoId) return image;
        return { ...image, isEditing: true };
      });
      return { ...prev, images: editImagesTrue };
    });
  };

  const closeModal = () => {
    modalRef.current.close();
    setShowModal(false);
  };

  const editPhotoTitle = (modalDataId, photoTitle, photoId) => {
    setPlaceData((prev) => {
      return prev.map((placeObj) => {
        if (placeObj.id !== modalDataId) return placeObj;

        const updatedPhotoTitle = placeObj.images.map((image) => {
          if (image.photoId !== photoId) return image;
          return { ...image, title: photoTitle };
        });

        return { ...placeObj, images: updatedPhotoTitle };
      });
    });
  };

  // console.log(modalData);
  // console.log(placeData);

  return (
    <>
      <div id="whole-container">
        {showModal && (
          <Modal
            ref={modalRef}
            modalData={modalData}
            placeData={placeData}
            closeModal={closeModal}
            addMorePhotos={addMorePhotos}
            deleteCurrentPhoto={deleteCurrentPhoto}
            testModalData={testModalData}
            editPhotoTitle={editPhotoTitle}
          />
        )}
        <List
          placeData={placeData}
          mapIsClicked={mapIsClicked}
          currentInput={currentInput}
          onClickMarker={onClickMarker}
          handleSubmit={handleSubmit}
          handleDelete={handleDelete}
          handleDeleteInput={handleDeleteInput}
          openModal={openModal}
          searchLocation={searchLocation}
        />
        {myPosition && (
          <div className="map">
            <MyMap
              ref={mapRef}
              myPosition={myPosition}
              placeData={placeData}
              mapIsClicked={mapIsClicked}
              initialMarker={initialMarker}
              handleMapClick={handleMapClick}
              setupInitialMarker={setupInitialMarker}
              onClickMarker={onClickMarker}
              addMorePhotos={addMorePhotos}
              openModal={openModal}
              isSearching={isSearching}
            />
          </div>
        )}
      </div>
    </>
  );
}

export default App;
