import { forwardRef, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ModalPhoto from "./ModalPhoto";
import { LazyLoadImage } from "react-lazy-load-image-component";

const Modal = forwardRef(function Modal(
  {
    closeModal,
    modalData,
    placeData,
    addMorePhotos,
    deleteCurrentPhoto,
    testModalData,
    editPhotoTitle,
  },
  ref
) {
  const [showClickedPhotoModal, setShowClickedPhotoModal] = useState(false);
  const [thePhoto, setThePhoto] = useState(null);
  const [thePhotoIndex, setThePhotoIndex] = useState(null);
  const [pagination, setPagination] = useState(null);

  const photosRef = useRef();
  const modalPhotoRef = useRef();
  const photoTitleRef = useRef();

  const inputIsActive = modalData.images.some((imageObj) => {
    return imageObj.isEditing === true;
  });

  console.log(inputIsActive);

  const saveTitle = (photoId) => {
    const title = photoTitleRef.current.value;
    editPhotoTitle(modalData.id, title, photoId);
  };

  useEffect(() => {
    if (thePhotoIndex < pagination) {
      showNextPhoto();
    } else if (thePhotoIndex > pagination) {
      showPreviousPhoto();
    }
  }, [pagination]);

  useEffect(() => {
    if (showClickedPhotoModal) {
      modalPhotoRef.current.showModal();
    }
  }, [showClickedPhotoModal]);

  const currData =
    placeData.length > 0 &&
    placeData.find((place) => place.id === modalData.id);

  const addPhotos = (e) => {
    e.preventDefault();

    let images = Array.from(photosRef.current.files);
    images = images.map((file) => {
      const photoId = Math.random();
      return {
        file: file,
        isEditing: false,
        photoId,
      };
    });

    console.log(images);
    addMorePhotos(currData, images);
  };

  //  ---------- NEXT AND PREVIOUS PHOTO FUNCTIONALITIES -----------

  const navigatePagination = (paginationIndex) => {
    setPagination(paginationIndex);
  };

  const showNextPhoto = () => {
    if (pagination >= modalData.images.length) return;

    const fileObj = modalData.images[pagination];
    setThePhoto(fileObj);
    setThePhotoIndex(pagination);
  };

  const showPreviousPhoto = () => {
    if (pagination < 0) return;

    const fileObj = modalData.images[pagination];
    setThePhoto(fileObj);
    setThePhotoIndex(pagination);
  };

  //  ---------- SHOW AND CLOSE CURRENT PHOTO FUNCTIONALITIES -----------

  const showCurrentPhoto = (imageObj, i) => {
    setShowClickedPhotoModal(true);
    setThePhoto(imageObj);
    setThePhotoIndex(i);
  };

  const closeCurrentPhoto = () => {
    setShowClickedPhotoModal(false);
    setThePhoto(null);
    modalPhotoRef.current.close();
  };

  return (
    <>
      {showClickedPhotoModal && (
        <ModalPhoto
          ref={modalPhotoRef}
          thePhoto={thePhoto}
          thePhotoIndex={thePhotoIndex}
          closeCurrentPhoto={closeCurrentPhoto}
          navigatePagination={navigatePagination}
        />
      )}
      <dialog
        key={modalData.id}
        className="popup_dialog"
        ref={ref}
        onClose={closeModal}
        initial={{ opacity: 0, y: "-100px" }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: "-100px" }}
        transition={{ duration: 0.5 }}
      >
        <div className="close_modal_action">
          <div>
            <button className="modal_close" onClick={closeModal}>
              X
            </button>
          </div>
        </div>
        <div className="modal_header dm-sans-light">
          <h1>{modalData.place}</h1>
          <p>{modalData.date}</p>
          <form onSubmit={(e) => addPhotos(e)}>
            <label htmlFor="img">Add more photos</label>
            <input
              className="input_bar"
              type="file"
              accept="image/*"
              ref={photosRef}
              name="images"
              id="img"
              style={{ display: "none" }}
              multiple
            />
            <button>submit</button>
          </form>
        </div>
        <div className="picture_container">
          <AnimatePresence>
            {modalData.images &&
              modalData.images.map((image, i) => {
                return (
                  <motion.div
                    className="modal_picture_container"
                    key={image.file.name}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, y: "-400px" }}
                    transition={{ delay: 0.1 * i }}
                  >
                    <LazyLoadImage
                      className="modal_picture"
                      src={URL.createObjectURL(image.file)}
                      onClick={() => showCurrentPhoto(image, i)}
                    />
                    <div className="modal_actions">
                      <div>
                        {image.isEditing ? (
                          <input
                            type="text"
                            ref={photoTitleRef}
                            className="modal_input_title"
                            placeholder={
                              image.title ? image.title : "Enter photo title..."
                            }
                            defaultValue={image.title}
                          />
                        ) : (
                          <p className="modal_photo_title">{image.title}</p>
                        )}
                      </div>
                      <div className="save_delete_div">
                        <div>
                          {image.isEditing ? (
                            <button
                              onClick={() => saveTitle(image.photoId)}
                              className="modal_save"
                            >
                              <img
                                className="check_icon"
                                src="https://cdn1.iconfinder.com/data/icons/material-core/20/check-circle-outline-512.png"
                              />
                            </button>
                          ) : (
                            <button
                              className="modal_edit"
                              onClick={() =>
                                testModalData(image.photoId, inputIsActive)
                              }
                            >
                              <img
                                className="edit_icon"
                                src="https://cdn3.iconfinder.com/data/icons/feather-5/24/edit-512.png"
                              />
                            </button>
                          )}
                        </div>
                        <div>
                          <button
                            className="modal_close"
                            onClick={() => deleteCurrentPhoto(modalData, image)}
                          >
                            <img
                              className="trash_icon"
                              src="https://cdn3.iconfinder.com/data/icons/font-awesome-regular-1/512/trash-can-512.png"
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
          </AnimatePresence>
        </div>
      </dialog>
    </>
  );
});

export default Modal;
