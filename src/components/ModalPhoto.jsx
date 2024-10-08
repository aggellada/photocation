import { forwardRef } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

const ModalPhoto = forwardRef(function ModalPhoto(
  { thePhoto, closeCurrentPhoto, thePhotoIndex, navigatePagination },
  ref
) {
  return (
    <dialog ref={ref} className="modal_photo" onClose={closeCurrentPhoto}>
      <button
        className="button_arrow"
        onClick={() => navigatePagination(thePhotoIndex - 1)}
      >
        <img
          src="https://cdn4.iconfinder.com/data/icons/navigation-40/24/chevron-left-512.png"
          alt="Left arrow"
          className="arrow"
        />
      </button>
      <div className="soloimg_modal_div">
        <LazyLoadImage
          src={URL.createObjectURL(thePhoto.file)}
          className="solo_photo"
        />
        <p>{thePhoto.title}</p>
      </div>
      <button
        className="button_arrow"
        onClick={() => navigatePagination(thePhotoIndex + 1)}
      >
        <img
          src="https://cdn4.iconfinder.com/data/icons/navigation-40/24/chevron-right-512.png"
          alt="Right arrow"
          className="arrow"
        />
      </button>
    </dialog>
  );
});

export default ModalPhoto;
