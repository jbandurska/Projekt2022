import "./PostInGrid.css";
import { FaHeart } from "@react-icons/all-files/fa/FaHeart";
import { FaComment } from "@react-icons/all-files/fa/FaComment";
import { useCallback, useState } from "react";
import Modal from "../../Modal";
import PictureModal from "../PictureModal/PictureModal";

export default function PostInGrid({
  picture,
  likes,
  comments,
  id,
  currentPostId,
  setCurrentPostId,
  changeCurrentPostId,
}) {
  const [showModal, setShowModal] = useState(false);
  const toggleModal = useCallback(() => {
    setShowModal(!showModal);
    setCurrentPostId(id);
  }, [showModal, id, setCurrentPostId]);

  return (
    <div className="post-in-grid">
      <img src={picture} alt={id} />
      <div className="cover" onClick={toggleModal}>
        <span>
          <FaHeart /> {likes}
        </span>
        <span>
          <FaComment /> {comments.length}
        </span>
      </div>
      {showModal ? (
        <Modal div="modal">
          <PictureModal
            showModal={showModal}
            toggleModal={toggleModal}
            id={currentPostId}
            changeCurrentPostId={changeCurrentPostId}
          />
        </Modal>
      ) : null}
    </div>
  );
}
