import { AnimatePresence, motion } from "framer-motion";

export default function Place({
  currObj,
  handleDelete,
  onClickMarker,
  openModal,
}) {
  return (
    <>
      <motion.div
        className="place_container"
        onClick={() => onClickMarker(currObj.marker)}
        initial={{ opacity: 0, x: "-100px" }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: "-100px" }}
        transition={{ duration: 1 }}
      >
        <div className="place_content">
          <h1 style={{ fontSize: "36px", fontWeight: "bold" }}>
            {currObj.place}
          </h1>
          <p>{currObj.date}</p>
        </div>
        <div className="close-btn-container">
          <img
            src="https://cdn3.iconfinder.com/data/icons/google-material-design-icons/48/ic_add_to_photos_48px-256.png"
            className="button_img"
            onClick={openModal}
          />
          <img
            src="https://cdn3.iconfinder.com/data/icons/font-awesome-regular-1/512/trash-can-256.png"
            className="button_img"
            onClick={() => handleDelete(currObj.id)}
          />
        </div>
      </motion.div>
    </>
  );
}
