import { forwardRef, useRef } from "react";
import Input from "./Input";
import Place from "./Place";
import { AnimatePresence } from "framer-motion";

const List = forwardRef(function List(
  {
    handleSubmit,
    onClickMarker,
    handleDelete,
    handleDeleteInput,
    placeData,
    mapIsClicked,
    currentInput,
    openModal,
    searchLocation,
  },
  ref
) {
  const searchRef = useRef();

  const submitSearch = () => {
    const city = searchRef.current.value;
    searchLocation(city);
  };

  return (
    <div className="list">
      <div className="list-header" style={{ marginTop: "30px" }}>
        <h1 style={{ textAlign: "center", color: "white" }}>
          <img
            src="https://cdn-icons-png.flaticon.com/128/854/854878.png"
            style={{ width: "50px" }}
          />
          PhotoCation
        </h1>
        <div className="search_bar">
          <input type="text" ref={searchRef} />
          <button onClick={submitSearch}>Search</button>
        </div>
      </div>
      {mapIsClicked && (
        <Input
          handleDeleteInput={handleDeleteInput}
          handleSubmit={handleSubmit}
          onClickMarker={onClickMarker}
          currentInput={currentInput}
        />
      )}
      <AnimatePresence>
        {placeData.length > 0 &&
          placeData.map((currObj) => {
            if (currObj.formSubmitted) {
              return (
                <Place
                  ref={ref}
                  key={currObj.id}
                  currObj={currObj}
                  onClickMarker={onClickMarker}
                  handleDelete={handleDelete}
                  openModal={openModal}
                />
              );
            }
          })}
      </AnimatePresence>
    </div>
  );
});

export default List;
