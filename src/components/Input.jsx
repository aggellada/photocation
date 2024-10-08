import { motion } from "framer-motion";
import { useRef } from "react";

export default function Input({
  onClickMarker,
  handleSubmit,
  currentInput,
  handleDeleteInput,
}) {
  const placeRef = useRef();
  const dateRef = useRef();
  const photosRef = useRef();

  const submitForm = (e) => {
    e.preventDefault();
    const place = placeRef.current.value;

    const date = dateRef.current.value;
    let images = Array.from(photosRef.current.files);
    images = images.map((file) => {
      const photoId = Math.random();
      return {
        file: file,
        isEditing: false,
        title: null,
        photoId,
      };
    });

    const currDate = new Date(date);
    const formattedDate = currDate.toLocaleDateString("en-US", {
      month: "long",
      day: "2-digit",
      year: "numeric",
    });

    const updatedData = {
      ...currentInput,
      formSubmitted: true,
      date: formattedDate,
      place,
      images,
    };

    handleSubmit(e, updatedData);
  };

  return (
    <motion.div
      className="input-container"
      onClick={() => onClickMarker(currentInput.marker)}
      initial={{ opacity: 0, x: "-100px" }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1 }}
    >
      <div className="close_top_btn_container">
        <img
          src="https://cdn1.iconfinder.com/data/icons/materia-arrows-symbols-vol-8/24/018_311_insignia_cross_emblem-512.png"
          className="button_img"
          onClick={() => handleDeleteInput(currentInput.id)}
        />
      </div>
      <form
        className="form-container"
        onSubmit={(e) => submitForm(e, currentInput)}
      >
        <div className="input-group">
          <label>Place: </label>
          <input
            className="input_bar"
            type="text"
            ref={placeRef}
            name="place"
            // required
          />
        </div>
        <div className="input-group">
          <label>Date: </label>
          <input
            className="input_bar"
            type="date"
            ref={dateRef}
            name="date"
            // required
          />
        </div>
        <div className="input-group">
          <label>Photos: </label>
          <input
            className="input_bar"
            type="file"
            accept="image/*"
            multiple
            ref={photosRef}
            name="images"
          />
        </div>
        <div className="add_div">
          <button>
            <img
              className="button_img"
              src="https://cdn1.iconfinder.com/data/icons/essentials-pack/96/bookmark_ribbon_save_web_label-512.png"
            />
          </button>
        </div>
      </form>
    </motion.div>
  );
}
